import { PUBLIC_PAYLOAD_URL } from '$env/static/public'
import type { Page, Media } from '@repo/payload-types'

export type { Page, Media }

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
  fetchFn: typeof fetch = fetch,
): Promise<Page | null> {
  const url = `${PUBLIC_PAYLOAD_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`

  const response = await fetchFn(url)
  if (!response.ok) return null

  const data = (await response.json()) as PaginatedDocs<Page>
  return data.docs[0] ?? null
}

/**
 * Fetches all pages from Payload's REST API.
 */
export async function getAllPages(fetchFn: typeof fetch = fetch): Promise<Page[]> {
  const url = `${PUBLIC_PAYLOAD_URL}/api/pages?limit=100`

  const response = await fetchFn(url)
  if (!response.ok) return []

  const data = (await response.json()) as PaginatedDocs<Page>
  return data.docs
}
