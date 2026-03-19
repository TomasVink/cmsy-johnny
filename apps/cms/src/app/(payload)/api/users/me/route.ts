import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyJwt } from '../../../../../lib/verifyJwt'

/**
 * Override Payload's /api/users/me endpoint to avoid a findByID(-1) database
 * call that Payload would otherwise make after the logto-jwt strategy returns
 * a synthetic user. We verify the cookie-JWT ourselves and return the user
 * directly — no database interaction needed.
 *
 * Uses payload.secret (sha256(PAYLOAD_SECRET).slice(0,32)) to match what
 * the callback route signs with and what the logto-jwt strategy verifies with.
 */
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return Response.json({ user: null })
  }

  const payload = await getPayload({ config })
  const claims = verifyJwt(token, payload.secret)
  if (!claims?.email || !claims.id || claims.collection !== 'users') {
    return Response.json({ user: null })
  }

  let exp = Math.floor(Date.now() / 1000) + 7200
  try {
    const [, payloadPart] = token.split('.')
    const decoded = JSON.parse(Buffer.from(payloadPart, 'base64url').toString())
    if (typeof decoded.exp === 'number') exp = decoded.exp
  } catch {}

  return Response.json({
    user: {
      id: claims.id,
      email: claims.email,
      collection: 'users',
      updatedAt: '',
      createdAt: '',
    },
    exp,
    token,
  })
}
