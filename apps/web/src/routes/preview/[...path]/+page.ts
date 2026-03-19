import type { PageLoad } from './$types'
import { getPageBySlug } from '$lib/payload'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params, fetch }) => {
  // params.path is the catch-all segment, e.g. "about" or "blog/my-post"
  const slug = params.path

  const page = await getPageBySlug(slug, fetch)

  if (!page) {
    error(404, `Page "${slug}" not found`)
  }

  return { page }
}
