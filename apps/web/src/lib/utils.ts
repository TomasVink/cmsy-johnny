/**
 * Prefixes an internal path with the current locale.
 * Anchor-only links (#section) and external URLs are returned unchanged.
 */
export function localizeHref(href: string, locale: string): string {
  if (href.startsWith('#') || href.startsWith('http')) return href
  return `/${locale}${href.startsWith('/') ? href : `/${href}`}`
}
