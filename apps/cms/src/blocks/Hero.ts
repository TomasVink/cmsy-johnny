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
      admin: { description: 'Main headline, e.g. "\'t is den Johnny!"' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Subtitle line, e.g. "FRIET · PEPERSAUS · CERVELA · CRISPY UITJES"' },
    },
    {
      name: 'ctaButtons',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'outline',
          options: [
            { label: 'Outline', value: 'outline' },
            { label: 'Solid', value: 'solid' },
          ],
        },
      ],
    },
  ],
}
