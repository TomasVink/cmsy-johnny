import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

const geocodeAddress: CollectionBeforeChangeHook = async ({ data }) => {
  const { address, postcode, city, gps } = data

  const hasAddress = address || postcode || city
  const missingCoords = !gps?.lat || !gps?.lng

  if (!hasAddress || !missingCoords) return data

  const apiKey = process.env.NEXT_PUBLIC_HERE_API_KEY
  if (!apiKey) return data

  const query = [address, postcode, city].filter(Boolean).join(', ')

  try {
    const res = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${apiKey}`
    )
    const json = await res.json()
    const position = json?.items?.[0]?.position
    if (position) {
      return { ...data, gps: { lat: position.lat, lng: position.lng } }
    }
  } catch {
    // geocoding failure is non-fatal
  }

  return data
}

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
    { name: 'postcode', type: 'text', label: 'Postcode' },
    { name: 'city', type: 'text', label: 'City' },
    { name: 'phone', type: 'text', label: 'Phone number' },
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
