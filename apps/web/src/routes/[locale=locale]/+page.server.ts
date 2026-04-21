import { getPageBySlug } from '$lib/payload.server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, parent }) => {
  const { locale } = await parent()
  const page = await getPageBySlug('home', locale, fetch)
  return { page }
}
