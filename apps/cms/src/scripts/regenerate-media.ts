/**
 * Re-processes existing media so it gets the webp sizes added in the
 * "media webp + hero size" change.
 *
 * Payload only runs sharp at upload time — changing `imageSizes` in
 * collections/Media.ts affects new uploads only. This script re-uploads the
 * original file of every existing media doc, which re-triggers resizing.
 *
 * Usage (from apps/cms, with .env pointing at the environment you want to fix):
 *   bun payload run src/scripts/regenerate-media.ts           # only docs missing webp sizes
 *   bun payload run src/scripts/regenerate-media.ts --all     # every doc
 *   bun payload run src/scripts/regenerate-media.ts --dry-run # report, change nothing
 *
 * To fix production, point DATABASE_URI, S3_* and NEXT_PUBLIC_SERVER_URL at
 * production and run it from your machine. Originals are downloaded over HTTP
 * from the CMS, resized locally, and written back to the same bucket.
 *
 * Safe to re-run: it overwrites the generated sizes of each doc and leaves the
 * original file untouched. Old (pre-webp) size files stay behind in the bucket
 * as orphans — harmless, and nothing links to them any more.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const args = process.argv.slice(2)
const force = args.includes('--all')
const dryRun = args.includes('--dry-run')

const payload = await getPayload({ config })

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const { docs } = await payload.find({
  collection: 'media',
  limit: 0,
  pagination: false,
  depth: 0,
})

let converted = 0
let skipped = 0
let failed = 0

for (const doc of docs) {
  const filename = doc.filename
  if (!filename) {
    skipped++
    continue
  }

  // SVGs and anything non-raster are passed through by sharp — no sizes to make.
  if (!doc.mimeType?.startsWith('image/') || doc.mimeType === 'image/svg+xml') {
    payload.logger.info(`skip (not a raster image): ${filename}`)
    skipped++
    continue
  }

  const alreadyWebp = doc.sizes?.hero?.mimeType === 'image/webp'
  if (alreadyWebp && !force) {
    skipped++
    continue
  }

  const url = `${serverURL}/api/media/file/${encodeURIComponent(filename)}`

  if (dryRun) {
    payload.logger.info(`would re-process: ${filename} (${doc.filesize ?? '?'} bytes)`)
    converted++
    continue
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GET ${url} → ${response.status}`)
    }
    const data = Buffer.from(await response.arrayBuffer())

    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {},
      file: {
        data,
        mimetype: doc.mimeType,
        name: filename,
        size: data.byteLength,
      },
      overwriteExistingFiles: true,
    })

    payload.logger.info(`re-processed: ${filename}`)
    converted++
  } catch (error) {
    payload.logger.error(`failed: ${filename} — ${error instanceof Error ? error.message : error}`)
    failed++
  }
}

payload.logger.info(
  `done — ${converted} ${dryRun ? 'to re-process' : 're-processed'}, ${skipped} skipped, ${failed} failed`,
)

process.exit(failed > 0 ? 1 : 0)
