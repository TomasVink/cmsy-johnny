import { redirect } from '@sveltejs/kit'
import { getSiteSettings } from '$lib/payload.server'
import type { LayoutServerLoad } from './$types'

const VALID_LOCALES = ['nl', 'fr'] as const
export type Locale = (typeof VALID_LOCALES)[number]

function isValidLocale(value: string): value is Locale {
  return VALID_LOCALES.includes(value as Locale)
}

function detectLocale(acceptLanguage: string | null, cookie: string | undefined): Locale {
  if (cookie && isValidLocale(cookie)) return cookie
  if (acceptLanguage?.toLowerCase().includes('fr')) return 'fr'
  return 'nl'
}

export const load: LayoutServerLoad = async ({ params, request, cookies, url, fetch }) => {
  if (!isValidLocale(params.locale)) {
    const locale = detectLocale(request.headers.get('accept-language'), cookies.get('locale'))
    const rest = url.pathname.slice(params.locale.length + 1)
    redirect(302, `/${locale}${rest || '/'}`)
  }

  const locale = params.locale as Locale
  cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })

  const settings = await getSiteSettings(locale, fetch)
  return { locale, settings }
}
