import type { Block } from 'payload'

export const IngredientsBlock: Block = {
  slug: 'ingredients',
  labels: { singular: 'Ingredients', plural: 'Ingredients blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      defaultValue: 'wat-is-een-johnnie',
      admin: { description: 'HTML anchor id for nav linking' },
    },
    { name: 'title', type: 'textarea', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'number', type: 'text', required: true, admin: { description: 'e.g. "01"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
