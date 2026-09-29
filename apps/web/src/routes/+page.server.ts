import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

function detectLocale(acceptLanguage: string | null, cookie: string | undefined): 'nl' | 'fr' {
  if (cookie === 'nl' || cookie === 'fr') return cookie
  if (acceptLanguage?.toLowerCase().includes('fr')) return 'fr'
  return 'nl'
}

// Fallback only — hooks.server.ts normally redirects before routing gets here,
// and it is what attaches Cache-Control: no-store. A load cannot return a
// Response, so this must throw instead.
export const load: PageServerLoad = ({ request, cookies }) => {
  const locale = detectLocale(request.headers.get('accept-language'), cookies.get('locale'))
  redirect(302, `/${locale}`)
}

export const ssr = true
