import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Verify a HS256 JWT signed by Payload's jwtSign (jose) using Node's built-in
 * HMAC-SHA256. Both encode the secret as UTF-8 bytes so the signatures match.
 */
export function verifyJwt(token: string, secret: string): Record<string, unknown> | null {
  try {
    const [header, payload, sig] = token.split('.')
    if (!header || !payload || !sig) return null

    const expected = createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url')

    // Pad both to equal length before comparing to satisfy timingSafeEqual
    const a = Buffer.from(sig.padEnd(expected.length, ' '))
    const b = Buffer.from(expected.padEnd(sig.length, ' '))
    if (!timingSafeEqual(a, b)) return null

    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (claims.exp && Math.floor(Date.now() / 1000) > claims.exp) return null
    return claims
  } catch {
    return null
  }
}
