import { env } from '$env/dynamic/public'
import type { Page, Media } from '@repo/payload-types'

export type { Page, Media }

export type NavLink = { label: string; href: string; id?: string }

export type SiteSettings = {
  logo?: Media
  navLinks?: NavLink[]
  navCta?: { label?: string; href?: string }
  footerLinks?: NavLink[]
  footerImage?: Media
}

// Block types extracted from the generated Page layout union
type LayoutBlock = NonNullable<Page['layout']>[number]
export type HeroBlock = Extract<LayoutBlock, { blockType: 'hero' }>
export type IngredientsBlock = Extract<LayoutBlock, { blockType: 'ingredients' }>
export type PhotoStripBlock = Extract<LayoutBlock, { blockType: 'photo-strip' }>
export type StatementBannerBlock = Extract<LayoutBlock, { blockType: 'statement-banner' }>
export type LocationsBlock = Extract<LayoutBlock, { blockType: 'locations' }>
export type FrituurbakkerSignupBlock = Extract<LayoutBlock, { blockType: 'frituurbakker-signup' }>
export type SocialBlock = Extract<LayoutBlock, { blockType: 'social' }>
export type TickerBannerBlock = Extract<LayoutBlock, { blockType: 'ticker-banner' }>
export type SignupBlock = Extract<LayoutBlock, { blockType: 'signup' }>
export type PolaroidsBlock = Extract<LayoutBlock, { blockType: 'polaroids' }>
export type MapBlock = Extract<LayoutBlock, { blockType: 'map' }>
export type ToolkitBlock = Extract<LayoutBlock, { blockType: 'toolkit' }>

// ── Media URL helper ──────────────────────────────────────────────
export type MediaSize = 'thumbnail' | 'card' | 'tablet' | 'hero'

// Largest → smallest. When a size isn't available, fall back to the next smaller one.
const SIZE_ORDER: readonly MediaSize[] = ['hero', 'tablet', 'card', 'thumbnail']

/** Payload returns absolute URLs built from NEXT_PUBLIC_SERVER_URL — strip the
 *  origin so the path can be re-hosted on the CDN domain. */
function toPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

/**
 * Resolves a Media doc to a URL, preferring a generated (webp) size over the
 * original upload and serving it from PUBLIC_MEDIA_URL (the CDN) when set.
 *
 * Media uploaded before webp conversion was added has no `sizes`; those fall
 * back through the size chain and finally to the original file.
 */
export function mediaUrl(
  media: Media | number | null | undefined,
  size?: MediaSize
): string | null {
  if (!media || typeof media === 'number') return null
  const base = env.PUBLIC_MEDIA_URL || env.PUBLIC_PAYLOAD_URL

  if (size) {
    const candidates = SIZE_ORDER.slice(SIZE_ORDER.indexOf(size))
    for (const s of candidates) {
      const sized = media.sizes?.[s]
      if (sized?.url) return `${base}${toPath(sized.url)}`
    }
  }

  if (media.url) return `${base}${toPath(media.url)}`
  if (media.filename) return `${base}/api/media/file/${media.filename}`
  return null
}

/** Intrinsic dimensions of the size `mediaUrl` would pick — set width/height on
 *  the <img> so the browser reserves space and the layout doesn't shift. */
export function mediaDimensions(
  media: Media | number | null | undefined,
  size?: MediaSize
): { width: number; height: number } | null {
  if (!media || typeof media === 'number') return null

  if (size) {
    const candidates = SIZE_ORDER.slice(SIZE_ORDER.indexOf(size))
    for (const s of candidates) {
      const sized = media.sizes?.[s]
      if (sized?.url && sized.width && sized.height) {
        return { width: sized.width, height: sized.height }
      }
    }
  }

  if (media.width && media.height) return { width: media.width, height: media.height }
  return null
}

export type PaginatedDocs<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

/**
 * Fetches a single page document by slug from Payload's REST API.
 */
export async function getPageBySlug(
  slug: string,
  locale: string,
  fetchFn: typeof fetch = fetch,
  baseUrl = env.PUBLIC_PAYLOAD_URL
): Promise<Page | null> {
  const url = `${baseUrl}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&locale=${locale}&limit=1`

  const response = await fetchFn(url)
  if (!response.ok) return null

  const data = (await response.json()) as PaginatedDocs<Page>
  return data.docs[0] ?? null
}

/**
 * Fetches the SiteSettings global from Payload's REST API.
 */
export async function getSiteSettings(
  locale: string,
  fetchFn: typeof fetch = fetch,
  baseUrl = env.PUBLIC_PAYLOAD_URL
): Promise<SiteSettings> {
  const url = `${baseUrl}/api/globals/site-settings?locale=${locale}`
  const response = await fetchFn(url)
  if (!response.ok) return {}
  return (await response.json()) as SiteSettings
}

/**
 * Fetches all pages from Payload's REST API.
 */
export async function getAllPages(
  locale: string,
  fetchFn: typeof fetch = fetch,
  baseUrl = env.PUBLIC_PAYLOAD_URL
): Promise<Page[]> {
  const url = `${baseUrl}/api/pages?locale=${locale}&limit=100`

  const response = await fetchFn(url)
  if (!response.ok) return []

  const data = (await response.json()) as PaginatedDocs<Page>
  return data.docs
}
