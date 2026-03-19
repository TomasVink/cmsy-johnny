import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Switch to S3-compatible storage when S3_BUCKET is set (production).
// Falls back to local disk at public/media/ in development.
const useS3 = Boolean(process.env.S3_BUCKET)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: Users.slug,
    components: {
      afterNavLinks: [{ path: '/src/components/TopBar', exportName: 'default' }],
      graphics: {
        Icon: '/src/components/Icon',
      },
    },
    livePreview: {
      collections: ['pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 800 },
      ],
    },
  },

  collections: [Users, Media, Pages],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  plugins: useS3
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET!,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY!,
              secretAccessKey: process.env.S3_SECRET_KEY!,
            },
            region: process.env.S3_REGION || 'auto',
            // Required for R2, MinIO, Backblaze B2, etc. Omit for standard AWS S3.
            endpoint: process.env.S3_ENDPOINT,
          },
        }),
      ]
    : [],

  // Writes generated types directly into the shared workspace package.
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/payload-types/src/index.ts'),
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharp: sharp as any,

  secret: process.env.PAYLOAD_SECRET || '',
})
