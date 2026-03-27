import type { Block } from 'payload'

export const CheckerDivider: Block = {
  slug: 'checker-divider',
  labels: { singular: 'Checker Banner', plural: 'Checker Banners' },
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
  ],
}
