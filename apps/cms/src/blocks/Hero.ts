import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero blocks' },
  fields: [
    {
      name: 'headline',
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: true,
      admin: { description: 'Main headline image' }
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: { description: 'Subtitle line, e.g. "FRIES · PEPPER SAUCE · CERVELA · CRISPY ONIONS"' }
    },
    {
      name: 'ctaButtons',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true, localized: true },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'outline',
          options: [
            { label: 'Outline', value: 'outline' },
            { label: 'Solid', value: 'solid' }
          ]
        }
      ]
    }
  ]
}
