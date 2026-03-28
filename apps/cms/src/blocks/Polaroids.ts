import type { Block } from 'payload'

export const PolaroidsBlock: Block = {
  slug: 'polaroids',
  labels: { singular: 'Polaroids', plural: 'Polaroids blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      defaultValue: 'polaroids',
      admin: {
        description: 'HTML anchor id for nav linking',
      },
    },
    {
      name: 'photos',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Caption shown at the bottom of the polaroid',
          },
        },
      ],
    },
  ],
}
