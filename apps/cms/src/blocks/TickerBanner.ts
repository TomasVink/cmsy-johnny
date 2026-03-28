import type { Block } from 'payload'

export const TickerBannerBlock: Block = {
  slug: 'ticker-banner',
  labels: {
    singular: 'Ticker Banner',
    plural: 'Ticker Banners',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'red',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Black', value: 'black' },
        { label: 'Yellow', value: 'yellow' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Text items that scroll across the banner. Separated by ✦ symbols.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
