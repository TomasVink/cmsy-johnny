import type { CollectionConfig } from 'payload'

export const FrituurApplications: CollectionConfig = {
  slug: 'frituur-applications',
  labels: { singular: 'Frituur Application', plural: 'Frituur Applications' },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user)
  },
  admin: {
    useAsTitle: 'frituurName',
    defaultColumns: ['frituurName', 'name', 'email', 'createdAt']
  },
  fields: [
    { name: 'frituurName', type: 'text', required: true, label: 'Naam frituur' },
    { name: 'name', type: 'text', required: true, label: 'Naam' },
    { name: 'address', type: 'text', label: 'Adres' },
    { name: 'postcode', type: 'text', label: 'Postcode' },
    { name: 'city', type: 'text', label: 'Gemeente' },
    {
      name: 'gps',
      type: 'group',
      label: 'GPS-coördinaten',
      admin: { description: 'Automatisch ingevuld via HERE API' },
      fields: [
        { name: 'lat', type: 'number', label: 'Breedtegraad (lat)' },
        { name: 'lng', type: 'number', label: 'Lengtegraad (lng)' }
      ]
    },
    { name: 'phone', type: 'text', label: 'Telefoonnummer' },
    { name: 'email', type: 'email', required: true, label: 'E-mailadres' },
    { name: 'visible', type: 'checkbox', defaultValue: false, label: 'Toon op kaart' }
  ],
  timestamps: true
}
