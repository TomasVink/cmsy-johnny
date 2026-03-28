import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Redirect unauthenticated users away from the Payload admin.
 *
 * When NEXT_PUBLIC_CMS_PLATFORM_URL is set the user is first sent to the
 * cmsy login page (with a return_to pointer back to this CMS's OAuth start
 * URL). cmsy handles Logto authentication and then redirects to return_to,
 * which kicks off a silent OAuth exchange here (the Logto session from cmsy
 * is already active, so no re-login prompt appears).
 *
 * Without NEXT_PUBLIC_CMS_PLATFORM_URL the user is redirected directly to
 * the Logto OAuth flow — useful for standalone dev without cmsy running.
 *
 * Only runs when LOGTO_APP_ID is present so the local-auth dev experience
 * still works without any Logto configuration.
 */
export function middleware(request: NextRequest) {
  if (!process.env.LOGTO_APP_ID) return NextResponse.next()

  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('payload-token')
    if (!token) {
      const serverUrl = process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_SERVER_URL || request.url
      const oauthStartUrl = new URL('/api/users/oauth/logto', serverUrl).toString()
      const cmsyUrl = process.env.NEXT_PUBLIC_CMS_PLATFORM_URL

      const redirectTarget = cmsyUrl
        ? `${cmsyUrl}/auth/sign-in?return_to=${encodeURIComponent(oauthStartUrl)}`
        : oauthStartUrl

      const response = NextResponse.redirect(redirectTarget)

      // Remember the specific admin path so the OAuth callback can restore it
      response.cookies.set('logto_return_to', pathname, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 600,
      })

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
