import type { Block } from 'payload'

export const PhotoStripBlock: Block = {
  slug: 'photo-strip',
  labels: { singular: 'Photo Strip', plural: 'Photo Strip blocks' },
  fields: [
    {
      name: 'photos',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
