import type { PageServerLoad } from './$types'

function detectLocale(acceptLanguage: string | null, cookie: string | undefined): 'nl' | 'fr' {
  if (cookie === 'nl' || cookie === 'fr') return cookie
  if (acceptLanguage?.toLowerCase().includes('fr')) return 'fr'
  return 'nl'
}

export const load: PageServerLoad = ({ request, cookies }) => {
  const locale = detectLocale(request.headers.get('accept-language'), cookies.get('locale'))
  // Returning the Response directly (instead of throwing redirect()) lets us put
  // Cache-Control on it: this is a per-visitor decision and must never be cached
  // at the edge, or the first visitor's language would be served to everyone.
  return new Response(null, {
    status: 302,
    headers: { Location: `/${locale}`, 'Cache-Control': 'no-store' }
  })
}

export const ssr = true
