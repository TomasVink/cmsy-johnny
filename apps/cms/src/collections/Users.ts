import type { CollectionConfig } from 'payload'
import { parseCookies } from 'payload'
import { verifyJwt } from '../lib/verifyJwt'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    hidden: true, // no user records to manage — auth is handled by Logto
  },
  // When Logto is configured, skip Payload's local auth entirely and use a
  // lightweight custom strategy that validates our cookie-JWT without any
  // database lookup.  Without LOGTO_APP_ID the default local auth still works.
  auth: {
    disableLocalStrategy: true,
    useSessions: false,
    strategies: [
      {
        name: 'logto-jwt',
        authenticate: async ({ headers, payload }) => {
          const cookies = parseCookies(headers)
          const token = cookies.get(`${payload.config.cookiePrefix}-token`)

          if (!token) return { user: null }

          const claims = verifyJwt(token, payload.secret)
          if (!claims?.email || !claims.id || claims.collection !== 'users') return { user: null }

          return {
            user: {
              id: claims.id as number,
              email: claims.email as string,
              collection: 'users',
              updatedAt: '',
              createdAt: '',
            } as any,
          }
        },
      },
    ],
  },
  // logtoSub is the stable, immutable Logto user ID used to look up existing
  // records on login. Querying by the auth-managed `email` field isn't
  // supported when disableLocalStrategy is true, so we use this instead.
  fields: [
    {
      name: 'logtoSub',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
    },
  ],
}
