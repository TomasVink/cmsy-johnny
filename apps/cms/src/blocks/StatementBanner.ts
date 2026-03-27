import type { Block } from 'payload'

export const StatementBannerBlock: Block = {
  slug: 'statement-banner',
  labels: { singular: 'Statement Banner', plural: 'Statement Banner blocks' },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "ZO SIMPEL DAT HET GENIAAL IS.", add *example text* to hightlight.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: { description: 'e.g. "FRIET ✦ PEPERSAUS ✦ CERVELA ✦ CRISPY UITJES"' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
