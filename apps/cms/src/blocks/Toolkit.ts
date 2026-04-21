import { Block } from 'payload'

export const Toolkit: Block = {
  slug: 'toolkit',
  fields: [
    { name: 'title', type: 'textarea', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true
        }
      ]
    }
  ]
}
