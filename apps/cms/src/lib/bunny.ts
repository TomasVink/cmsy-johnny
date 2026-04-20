const BUNNY_API_KEY = process.env.BUNNY_API_KEY
const BUNNY_PULLZONE_ID = process.env.BUNNY_PULLZONE_ID
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL

const LOCALES = ['nl', 'fr']

async function purgeUrl(url: string): Promise<void> {
  await fetch(`https://api.bunny.net/purge?url=${encodeURIComponent(url)}&async=false`, {
    method: 'POST',
    headers: { AccessKey: BUNNY_API_KEY! },
  })
}

export async function purgePageCache(slug: string): Promise<void> {
  if (!BUNNY_API_KEY || !WEB_URL) return
  await Promise.all(
    LOCALES.map(locale => {
      const url = slug === 'home' ? `${WEB_URL}/${locale}` : `${WEB_URL}/${locale}/${slug}`
      return purgeUrl(url)
    }),
  )
}

export async function purgeAllCache(): Promise<void> {
  if (!BUNNY_API_KEY || !BUNNY_PULLZONE_ID) return
  await fetch(`https://api.bunny.net/pullzone/${BUNNY_PULLZONE_ID}/purgeCache`, {
    method: 'POST',
    headers: { AccessKey: BUNNY_API_KEY },
  })
}
