import { cookies } from 'next/headers'

export async function GET() {
  const state = crypto.randomUUID()
  const cookieStore = await cookies()

  cookieStore.set('logto_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  const params = new URLSearchParams({
    client_id: process.env.LOGTO_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_SERVER_URL}/api/users/oauth/logto/callback`,
    response_type: 'code',
    scope: 'openid email profile urn:logto:scope:organizations',
    state,
  })

  return Response.redirect(`${process.env.LOGTO_ENDPOINT}/oidc/auth?${params}`, 302)
}
