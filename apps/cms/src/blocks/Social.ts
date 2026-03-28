import type { Block } from 'payload'

export const SocialBlock: Block = {
  slug: 'social',
  labels: { singular: 'Social Media', plural: 'Social Media blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      defaultValue: 'social',
      admin: { description: 'HTML anchor id for nav linking' }
    },
    { name: 'title', type: 'textarea', required: true, localized: true },
    { name: 'subtitle', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'accounts',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' }
          ]
        },
        { name: 'handle', type: 'text', required: true },
        { name: 'url', type: 'text', required: true }
      ]
    }
  ]
}
