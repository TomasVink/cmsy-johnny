import { getAllPages } from '$lib/payload'

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
  const pages = await getAllPages(fetch)
  return { pages }
}
