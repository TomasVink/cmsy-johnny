import type { Block } from 'payload'

export const LocationsBlock: Block = {
  slug: 'locations',
  labels: { singular: 'Locations', plural: 'Locations blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      defaultValue: 'vind-een-frituur',
      admin: { description: 'HTML anchor id for nav linking' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    {
      name: 'locations',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'text' },
        { name: 'city', type: 'text' },
        {
          name: 'lat',
          type: 'number',
          admin: { description: 'Latitude (decimal degrees)' },
        },
        {
          name: 'lng',
          type: 'number',
          admin: { description: 'Longitude (decimal degrees)' },
        },
      ],
    },
  ],
}
