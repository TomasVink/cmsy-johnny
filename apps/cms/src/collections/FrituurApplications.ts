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
    { name: 'frituurName', type: 'text', required: true, label: 'Frituur name' },
    { name: 'name', type: 'text', required: true, label: 'Contact name' },
    { name: 'address', type: 'text', label: 'Address' },
    { name: 'postcode', type: 'text', label: 'Postcode' },
    { name: 'city', type: 'text', label: 'City' },
    {
      name: 'gps',
      type: 'group',
      label: 'GPS coordinates',
      admin: { description: 'Auto-filled via HERE API when the address is entered on the website' },
      fields: [
        { name: 'lat', type: 'number', label: 'Latitude (lat)' },
        { name: 'lng', type: 'number', label: 'Longitude (lng)' }
      ]
    },
    { name: 'phone', type: 'text', label: 'Phone number' },
    { name: 'email', type: 'email', required: true, label: 'Email address' },
    { name: 'visible', type: 'checkbox', defaultValue: false, label: 'Show on map' }
  ],
  timestamps: true
}
