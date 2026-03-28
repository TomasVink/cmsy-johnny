import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

function detectLocale(acceptLanguage: string | null, cookie: string | undefined): 'nl' | 'fr' {
  if (cookie === 'nl' || cookie === 'fr') return cookie
  if (acceptLanguage?.toLowerCase().includes('fr')) return 'fr'
  return 'nl'
}

export const load: PageServerLoad = ({ request, cookies }) => {
  const locale = detectLocale(
    request.headers.get('accept-language'),
    cookies.get('locale')
  )
  redirect(302, `/${locale}`)
}
