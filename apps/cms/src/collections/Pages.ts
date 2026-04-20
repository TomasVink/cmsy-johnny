import type { CollectionConfig } from 'payload'
import { purgePageCache } from '../lib/bunny'
import { HeroBlock } from '../blocks/Hero'
import { IngredientsBlock } from '../blocks/Ingredients'
import { PhotoStripBlock } from '../blocks/PhotoStrip'
import { StatementBannerBlock } from '../blocks/StatementBanner'
import { LocationsBlock } from '../blocks/Locations'
import { SignupBlock } from '../blocks/Signup'
import { SocialBlock } from '../blocks/Social'
import { TickerBannerBlock } from '../blocks/TickerBanner'
import { CheckerDivider } from '../blocks/CheckerDivider'
import { PolaroidsBlock } from '../blocks/Polaroids'
import { MapBlock } from '../blocks/Map'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true
  },
  hooks: {
    afterChange: [({ doc }) => purgePageCache(doc.slug)],
    afterDelete: [({ doc }) => purgePageCache(doc.slug)],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const webURL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:5173'
        const slug = data?.slug as string | undefined
        const lang = (locale as unknown as string | undefined) ?? 'nl'
        return slug === 'home' ? `${webURL}/${lang}` : `${webURL}/${lang}/${slug ?? ''}`
      }
    }
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. "home" or "about".'
      }
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
        PolaroidsBlock,
        MapBlock
      ]
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true }
      ]
    }
  ]
}
