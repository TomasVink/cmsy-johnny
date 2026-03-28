import type { Block } from 'payload'
import { localeDefault } from '@/utils/localeDefault'

export const IngredientsBlock: Block = {
  slug: 'ingredients',
  labels: { singular: 'Ingredients', plural: 'Ingredients blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      localized: true,
      defaultValue: localeDefault('wat-is-een-johnnie', 'c-est-quoi'),
      admin: { description: 'HTML anchor id for nav linking' },
    },
    { name: 'title', type: 'textarea', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'number', type: 'text', required: true, admin: { description: 'e.g. "01"' } },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
