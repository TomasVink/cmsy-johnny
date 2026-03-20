# Build context must be the monorepo root:
#   docker build -f apps/cms/Dockerfile .

# Builder uses Debian-based bun (glibc) so native binaries (esbuild, sharp, etc.)
# resolve correctly. The slim runtime uses node:alpine.
FROM oven/bun:1.3.11 AS base

# ── Install dependencies ───────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy all workspace manifests so Bun can resolve the full dependency graph
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/cms/package.json ./apps/cms/
COPY packages/payload-types/package.json ./packages/payload-types/

RUN bun install

# ── Build ──────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Set here to avoid cross-env (which requires node) — matches the build script's values
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=8000"

WORKDIR /app/apps/cms
RUN bunx --bun next build

# ── Runtime ───────────────────────────────────────────────────────────────────
# Use Node (not Bun) to run the Next.js standalone server
FROM node:22.17.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# outputFileTracingRoot is set to the monorepo root, so Next.js places server.js
# at apps/cms/server.js inside the standalone directory
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/public ./apps/cms/public

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node apps/cms/server.js
