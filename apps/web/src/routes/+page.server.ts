import { getPageBySlug, getSiteSettings } from '$lib/payload.server'

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
  const [page, settings] = await Promise.all([
    getPageBySlug('home', fetch),
    getSiteSettings(fetch),
  ])
  return { page, settings }
}
