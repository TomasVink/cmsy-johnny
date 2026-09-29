import { getPageBySlug } from '$lib/payload.server'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, fetch, parent, setHeaders }) => {
  const { locale } = await parent()
  const page = await getPageBySlug(params.slug, locale, fetch)

  if (!page) {
    error(404, `Page not found`)
  }

  // Browsers always revalidate; the CDN serves from edge for 2 min and keeps
  // serving stale for an hour while it refreshes in the background. Publishing
  // in the CMS purges the affected URLs immediately (see cms/src/lib/bunny.ts).
  setHeaders({
    'Cache-Control': 'public, max-age=0, must-revalidate, s-maxage=120, stale-while-revalidate=3600'
  })

  return { page }
}
