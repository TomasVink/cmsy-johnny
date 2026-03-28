import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { FrituurApplications } from './collections/FrituurApplications'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Switch to S3-compatible storage when S3_BUCKET is set (production).
// Falls back to local disk at public/media/ in development.
const useS3 = Boolean(process.env.S3_BUCKET)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: (process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:5173').split(','),

  localization: {
    locales: [
      { label: 'NL', code: 'nl' },
      { label: 'FR', code: 'fr' }
    ],
    defaultLocale: 'nl',
    fallback: true
  },

  admin: {
    user: Users.slug,
    components: {
      afterNavLinks: [{ path: '/src/components/TopBar', exportName: 'default' }],
      graphics: {
        Icon: '/src/components/Icon'
      }
    },
    livePreview: {
      collections: ['pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 800 }
      ]
    }
  },

  collections: [Users, Media, Pages, FrituurApplications],

  globals: [SiteSettings],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || ''
    },
    migrationDir: path.resolve(dirname, 'migrations')
  }),

  plugins: [
    importExportPlugin({
      collections: [
        {
          slug: 'frituur-applications',
          import: false,
          export: {
            disableJobsQueue: true
          }
        }
      ]
    }),
    ...(useS3
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: process.env.NEXT_PUBLIC_PROJECT_SLUG,
                disableLocalStorage: true
              }
            },
            bucket: process.env.S3_BUCKET!,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_KEY!
              },
              region: process.env.S3_REGION || 'auto'
            }
          })
        ]
      : [])
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharp: sharp as any,

  secret: process.env.PAYLOAD_SECRET || ''
})
