/**
 * Returns a Payload defaultValue function that resolves to the correct
 * string for the active locale, falling back to nl for unknown locales.
 *
 * Usage:
 *   { name: 'title', type: 'text', localized: true, defaultValue: localeDefault('Titel', 'Titre') }
 */
export function localeDefault(nl: string, fr: string) {
  return ({ locale }: { locale?: string }) => (locale === 'fr' ? fr : nl)
}
