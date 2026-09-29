import type { Handle } from '@sveltejs/kit'

const LOCALES = ['nl', 'fr'] as const
type Locale = (typeof LOCALES)[number]

function detectLocale(acceptLanguage: string | null, cookie: string | undefined): Locale {
  if (cookie === 'nl' || cookie === 'fr') return cookie
  if (acceptLanguage?.toLowerCase().includes('fr')) return 'fr'
  return 'nl'
}

/**
 * Redirect anything that isn't locale-prefixed to the visitor's language.
 *
 * This lives in a hook rather than a page `load` because a `load` must return a
 * plain object — returning a Response there is a 500. A hook can return one, so
 * this is the only place the redirect can carry `Cache-Control: no-store`, which
 * it must: the target depends on the visitor's Accept-Language and cookie, and a
 * CDN that cached it would serve the first visitor's language to everyone after.
 *
 * It also short-circuits before routing, so a redirect costs no page render.
 */
export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url
  const first = pathname.split('/')[1] ?? ''

  // Never bounce SvelteKit internals, API calls, or anything file-shaped
  // (favicon.ico, robots.txt) — those must reach their real handler.
  const isLocalePrefixed = (LOCALES as readonly string[]).includes(first)
  const isInternal = first === '_app' || first === 'api' || first.includes('.')

  if (!isLocalePrefixed && !isInternal) {
    const locale = detectLocale(
      event.request.headers.get('accept-language'),
      event.cookies.get('locale')
    )
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${locale}${pathname === '/' ? '' : pathname}${event.url.search}`,
        'Cache-Control': 'no-store'
      }
    })
  }

  return resolve(event)
}
