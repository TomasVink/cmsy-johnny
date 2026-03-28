import type { Block } from 'payload'
import { localeDefault } from '@/utils/localeDefault'

export const LocationsBlock: Block = {
  slug: 'locations',
  labels: { singular: 'Locations', plural: 'Locations blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      localized: true,
      defaultValue: localeDefault('vind-een-frituur', 'trouver-une-friterie'),
      admin: { description: 'HTML anchor id for nav linking' },
    },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    {
      name: 'locations',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'address', type: 'text', localized: true },
        { name: 'city', type: 'text', localized: true },
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
