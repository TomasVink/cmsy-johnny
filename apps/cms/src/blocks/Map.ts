import { localeDefault } from '@/utils/localeDefault'
import { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'map',
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      localized: true,
      defaultValue: localeDefault('frituren', 'les-fritures'),
      admin: { description: 'HTML anchor id for nav linking' }
    },
    { name: 'title', type: 'textarea', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true }
  ]
}
