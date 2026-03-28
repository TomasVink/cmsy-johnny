import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload, jwtSign } from 'payload'
import config from '@payload-config'

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.')
  return JSON.parse(Buffer.from(payload, 'base64url').toString())
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('logto_oauth_state')?.value

  if (!code || !state || state !== savedState) {
    return new NextResponse('Invalid OAuth state', { status: 400 })
  }

  // Exchange authorization code for tokens
  const tokenRes = await fetch(`${process.env.LOGTO_ENDPOINT}/oidc/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.LOGTO_APP_ID!,
      client_secret: process.env.LOGTO_APP_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_SERVER_URL}/api/users/oauth/logto/callback`,
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error('[Logto] token exchange failed:', err)
    return new NextResponse('Authentication failed', { status: 401 })
  }

  const { id_token } = (await tokenRes.json()) as { id_token: string }
  const claims = decodeJwtPayload(id_token)

  const email = claims.email as string | undefined
  if (!email) {
    return new NextResponse('No email claim in token', { status: 401 })
  }

  // Verify organization membership — LOGTO_ORG_ID is required when using Logto auth.
  // Every CMS instance must belong to exactly one Logto organization; without this
  // check any authenticated Logto user could edit any project.
  const requiredOrg = process.env.LOGTO_ORG_ID
  if (!requiredOrg) {
    console.error('[Logto] LOGTO_ORG_ID is not set — cannot enforce project access control')
    return new NextResponse('Server misconfiguration: LOGTO_ORG_ID is required', { status: 500 })
  }
  const organizations = (claims.organizations as string[] | undefined) ?? []
  if (!organizations.includes(requiredOrg)) {
    return new NextResponse('Access denied: not a member of this project', { status: 403 })
  }

  // Upsert the user in Payload's DB so findByID works during admin SSR.
  // We key on logtoSub (immutable) rather than email (can change).
  const logtoSub = claims.sub as string
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'users',
    where: { logtoSub: { equals: logtoSub } },
    limit: 1,
    overrideAccess: true,
  })
  const userId =
    existing.docs[0]?.id ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await payload.create({ collection: 'users', data: { email, logtoSub } as any, overrideAccess: true }))
      .id

  // Issue a JWT signed with payload.secret (the derived key Payload uses internally).
  // payload.secret = sha256(PAYLOAD_SECRET).slice(0,32) — NOT the raw env var.
  // The custom 'logto-jwt' strategy in Users.ts verifies with payload.secret too.
  const tokenExpiration = 7200
  const { token } = await jwtSign({
    fieldsToSign: { id: userId, email, logtoSub: claims.sub, collection: 'users' },
    secret: payload.secret,
    tokenExpiration,
  })

  // Restore the admin path the user originally requested (set by middleware).
  // Validate it starts with /admin to prevent open-redirect abuse.
  const rawReturn = cookieStore.get('logto_return_to')?.value ?? ''
  const returnPath = rawReturn.startsWith('/admin') ? rawReturn : '/admin'

  const serverUrl = process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_SERVER_URL || request.url
  const response = NextResponse.redirect(new URL(returnPath, serverUrl))
  response.cookies.delete('logto_oauth_state')
  response.cookies.delete('logto_return_to')
  response.cookies.set('payload-token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: tokenExpiration,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
