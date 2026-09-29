import { getPageBySlug } from '$lib/payload.server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, parent, setHeaders }) => {
  const { locale } = await parent()
  const page = await getPageBySlug('home', locale, fetch)

  // Shorter window than other pages — the home page changes most often.
  setHeaders({
    'Cache-Control': 'public, max-age=0, must-revalidate, s-maxage=30, stale-while-revalidate=120'
  })

  return { page }
}
