import type { CollectionConfig, CollectionBeforeChangeHook, FieldHook } from 'payload'

const ADDRESS_FIELDS = ['address', 'postcode', 'city'] as const

type LatLng = { lat: number; lng: number }

const hasCoords = (gps?: { lat?: number | null; lng?: number | null } | null) =>
  typeof gps?.lat === 'number' && typeof gps?.lng === 'number'

const geocode = async (query: string, apiKey: string, attempt = 0): Promise<LatLng | null> => {
  const res = await fetch(
    `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${apiKey}`
  )
  // Bulk CSV imports fire many requests in a row — back off on rate limiting
  if (res.status === 429 && attempt < 3) {
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt))
    return geocode(query, apiKey, attempt + 1)
  }
  if (!res.ok) throw new Error(`HERE geocode ${res.status}`)
  const json = await res.json()
  const position = json?.items?.[0]?.position
  return position ? { lat: position.lat, lng: position.lng } : null
}

/**
 * Fills gps.lat/lng from the address on create, and re-geocodes on update when any
 * address field changed. Runs for admin edits, API calls and CSV imports alike.
 * Coordinates that are set explicitly (without an address change) are left alone.
 */
const geocodeAddress: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  // Updates (incl. CSV upserts) may only carry a subset of fields — fall back to the stored doc
  const merged = Object.fromEntries(
    ADDRESS_FIELDS.map((f) => [f, (data[f] !== undefined ? data[f] : originalDoc?.[f]) || ''])
  ) as Record<(typeof ADDRESS_FIELDS)[number], string>

  const addressChanged =
    operation === 'update' &&
    ADDRESS_FIELDS.some((f) => data[f] !== undefined && (data[f] || '') !== (originalDoc?.[f] || ''))

  const gps = data.gps !== undefined ? data.gps : originalDoc?.gps
  const gpsEditedManually =
    data.gps !== undefined &&
    (data.gps?.lat !== originalDoc?.gps?.lat || data.gps?.lng !== originalDoc?.gps?.lng)

  const needsGeocode = addressChanged ? !gpsEditedManually : !hasCoords(gps)
  const query = ADDRESS_FIELDS.map((f) => merged[f]).filter(Boolean).join(', ')

  if (!needsGeocode || !query) return data

  const apiKey = process.env.NEXT_PUBLIC_HERE_API_KEY
  if (!apiKey) {
    req.payload.logger.warn('NEXT_PUBLIC_HERE_API_KEY not set — skipping geocoding')
    return data
  }

  try {
    const position = await geocode(query, apiKey)
    if (position) return { ...data, gps: position }
    req.payload.logger.warn(`No geocode result for "${query}"`)
  } catch (err) {
    // geocoding failure is non-fatal
    req.payload.logger.error({ err, msg: `Geocoding failed for "${query}"` })
  }

  // Address moved but we couldn't resolve it — drop stale coords rather than pin the old spot
  return addressChanged ? { ...data, gps: { lat: null, lng: null } } : data
}

// The CSV importer casts numeric-looking cells (e.g. postcode 9990) to numbers
const toText: FieldHook = ({ value }) => (typeof value === 'number' ? String(value) : value)

export const FrituurApplications: CollectionConfig = {
  slug: 'frituur-applications',
  labels: { singular: 'Frituur Application', plural: 'Frituur Applications' },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (req.user) return true
      // Public requests only see visible entries
      return { visible: { equals: true } }
    },
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user)
  },
  admin: {
    useAsTitle: 'frituurName',
    defaultColumns: ['frituurName', 'email', 'city', 'visible', 'createdAt']
  },
  fields: [
    { name: 'frituurName', type: 'text', required: true, label: 'Frituur name' },
    { name: 'name', type: 'text', label: 'Contact name' },
    {
      name: 'address',
      type: 'text',
      label: 'Street + number',
      admin: {
        components: {
          Field: '/src/components/AddressAutocomplete'
        }
      }
    },
    { name: 'postcode', type: 'text', label: 'Postcode', hooks: { beforeValidate: [toText] } },
    { name: 'city', type: 'text', label: 'City' },
    { name: 'phone', type: 'text', label: 'Phone number', hooks: { beforeValidate: [toText] } },
    { name: 'email', type: 'email', label: 'Email address' },
    {
      name: 'urlType',
      type: 'select',
      label: 'Link type',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'TikTok', value: 'tiktok' }
      ]
    },
    { name: 'url', type: 'text', label: 'URL', admin: { placeholder: 'https://...' } },
    {
      name: 'handle',
      type: 'text',
      label: 'Handle (optional display text)',
      admin: { placeholder: '@' }
    },
    { name: 'visible', type: 'checkbox', defaultValue: false, label: 'Show on map' },
    {
      name: 'gps',
      type: 'group',
      label: 'GPS coordinates',
      admin: { description: 'Auto-filled via HERE API when the address is entered' },
      fields: [
        { name: 'lat', type: 'number', label: 'Latitude (lat)' },
        { name: 'lng', type: 'number', label: 'Longitude (lng)' }
      ]
    }
  ],
  hooks: {
    beforeChange: [geocodeAddress]
  },
  timestamps: true
}
