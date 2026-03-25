/**
 * Next.js instrumentation hook — runs once when the server process starts,
 * before any requests are handled.
 *
 * Runs pending Payload migrations automatically so the database schema is
 * always up-to-date without a separate migration step in the deployment
 * pipeline. Migrations are idempotent — already-applied ones are skipped.
 */
export async function register() {
  // Only run in production and in the Node.js runtime — not in Edge or during the build.
  // In development, run migrations manually via `bun run payload migrate`.
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')

    const payload = await getPayload({ config })
    try {
      await payload.db.migrate()
    } catch (err) {
      console.error('Database migration failed:', err instanceof Error ? err.stack : String(err))
      process.exit(1)
    }
  }
}
