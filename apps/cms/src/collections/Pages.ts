import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero'
import { IngredientsBlock } from '../blocks/Ingredients'
import { PhotoStripBlock } from '../blocks/PhotoStrip'
import { StatementBannerBlock } from '../blocks/StatementBanner'
import { LocationsBlock } from '../blocks/Locations'
import { SignupBlock } from '../blocks/Signup'
import { SocialBlock } from '../blocks/Social'
import { TickerBannerBlock } from '../blocks/TickerBanner'
import { CheckerDivider } from '@/blocks/CheckerDivider'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const webURL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:5173'
        const slug = data?.slug as string | undefined
        return `${webURL}/${slug ?? ''}`
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. "home" or "about".',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        IngredientsBlock,
        PhotoStripBlock,
        StatementBannerBlock,
        LocationsBlock,
        SignupBlock,
        SocialBlock,
        TickerBannerBlock,
        CheckerDivider,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
