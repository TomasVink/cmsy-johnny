import { getPageBySlug } from '$lib/payload.server'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
  const { locale } = await parent()
  const page = await getPageBySlug(params.slug, locale, fetch)

  if (!page) {
    error(404, `Page not found`)
  }

  return { page }
}
