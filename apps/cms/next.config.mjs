import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Standalone output has no disk cache, so the data cache is in-memory only.
  // Setting this to 0 disables in-process caching entirely, preventing unbounded growth.
  cacheMaxMemorySize: 0,
  webpack: webpackConfig => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  output: 'standalone',
  // Required for Next.js standalone to include monorepo workspace packages.
  // With this set, server.js lives at apps/cms/server.js inside .next/standalone.
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
