import { getPageBySlug } from '$lib/payload'
import { error } from '@sveltejs/kit'

export const load = async ({
  params,
  fetch,
}: {
  params: { slug: string }
  fetch: typeof globalThis.fetch
}) => {
  const page = await getPageBySlug(params.slug, fetch)

  if (!page) {
    error(404, `Page not found`)
  }

  return { page }
}
