import type { GlobalConfig } from 'payload'
import { purgeAllCache } from '../lib/bunny'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user)
  },
  hooks: {
    afterChange: [() => purgeAllCache()]
  },
  admin: {
    group: 'Settings'
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main site logo' }
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true, localized: true }
      ]
    },
    {
      name: 'navCta',
      type: 'group',
      label: 'Nav CTA Button',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text', localized: true }
      ]
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer Links',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'href', type: 'text', required: true, localized: true }
      ]
    },
    {
      name: 'footerImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Image',
      admin: { description: 'Image shown above the footer' }
    }
  ]
}
