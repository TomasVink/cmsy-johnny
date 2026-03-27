import { getPageBySlug, getSiteSettings } from '$lib/payload.server'
import { error } from '@sveltejs/kit'

export const load = async ({
  params,
  fetch,
}: {
  params: { slug: string }
  fetch: typeof globalThis.fetch
}) => {
  const [page, settings] = await Promise.all([
    getPageBySlug(params.slug, fetch),
    getSiteSettings(fetch),
  ])

  if (!page) {
    error(404, `Page not found`)
  }

  return { page, settings }
}
