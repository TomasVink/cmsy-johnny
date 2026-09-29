import type { PageServerLoad } from './$types'

function detectLocale(acceptLanguage: string | null, cookie: string | undefined): 'nl' | 'fr' {
  if (cookie === 'nl' || cookie === 'fr') return cookie
  if (acceptLanguage?.toLowerCase().includes('fr')) return 'fr'
  return 'nl'
}

export const load: PageServerLoad = ({ params, request, cookies }) => {
  const locale = detectLocale(request.headers.get('accept-language'), cookies.get('locale'))
  // Per-visitor language decision — never cache it at the edge.
  return new Response(null, {
    status: 302,
    headers: { Location: `/${locale}/${params.slug}`, 'Cache-Control': 'no-store' }
  })
}
