/**
 * Server-only Payload client.
 *
 * Uses PAYLOAD_INTERNAL_URL (e.g. http://cms:3000) for SSR fetches so
 * requests stay on the Docker internal network. Falls back to PUBLIC_PAYLOAD_URL
 * in local dev where PAYLOAD_INTERNAL_URL is not set.
 *
 * Import from here in +page.server.ts / +layout.server.ts files.
 * Never import from this module in client-side code.
 */
import { env } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { getAllPages as _getAllPages, getPageBySlug as _getPageBySlug, getSiteSettings as _getSiteSettings } from './payload'

export type { Page, Media, PaginatedDocs, SiteSettings } from './payload'

function internalUrl(): string {
  return env.PAYLOAD_INTERNAL_URL || publicEnv.PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
}

export function getPageBySlug(slug: string, locale: string, fetchFn: typeof fetch = fetch) {
  return _getPageBySlug(slug, locale, fetchFn, internalUrl())
}

export function getAllPages(locale: string, fetchFn: typeof fetch = fetch) {
  return _getAllPages(locale, fetchFn, internalUrl())
}

export function getSiteSettings(locale: string, fetchFn: typeof fetch = fetch) {
  return _getSiteSettings(locale, fetchFn, internalUrl())
}
