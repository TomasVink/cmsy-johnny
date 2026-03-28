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
