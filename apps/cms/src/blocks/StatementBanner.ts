import type { Block } from 'payload'

export const StatementBannerBlock: Block = {
  slug: 'statement-banner',
  labels: { singular: 'Statement Banner', plural: 'Statement Banner blocks' },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Large headline text. Wrap words in *asterisks* to highlight them.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: { description: 'Optional tagline below the headline, e.g. "FRIES ✦ PEPPER SAUCE ✦ CERVELA ✦ CRISPY ONIONS"' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
