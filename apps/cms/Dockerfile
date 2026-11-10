# Build context must be the monorepo root:
#   docker build -f apps/cms/Dockerfile .

# Next.js 16 runs under Node: Bun (1.3.11 and 1.4.2) can't load its compiled
# server runtime ("Expected CommonJS module to have a function wrapper").
# Bun is only used for installing and for bundling the migrations.
# Builder and runtime are both Debian (glibc) so native binaries like sharp
# installed here match the runtime.
FROM node:24-bookworm AS builder
COPY --from=oven/bun:1.3.11 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app

# ── Install dependencies ───────────────────────────────────────────────────────
# Copy manifests first so this layer is cached independently of source changes.
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/cms/package.json ./apps/cms/
COPY packages/payload-types/package.json ./packages/payload-types/

RUN bun install

# ── Build ──────────────────────────────────────────────────────────────────────
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Set here to avoid cross-env (which requires node) — matches the build script's values
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=2048"

# NEXT_PUBLIC_* vars used in 'use client' components are baked in at build time.
ARG NEXT_PUBLIC_HERE_API_KEY
ENV NEXT_PUBLIC_HERE_API_KEY=$NEXT_PUBLIC_HERE_API_KEY

WORKDIR /app/apps/cms
RUN ./node_modules/.bin/next build

# Compile migration TS files to self-contained JS bundles.
# The standalone runtime can't import TS, and @payloadcms/db-postgres may not
# be resolvable from the migrations directory — bundling makes them standalone.
RUN for f in src/migrations/[0-9]*.ts; do \
      [ -f "$f" ] || continue; \
      name=$(basename "$f" .ts); \
      bun build "$f" --outfile "src/migrations-compiled/${name}.js" --target node; \
    done

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# outputFileTracingRoot is set to the monorepo root, so Next.js places server.js
# at apps/cms/server.js inside the standalone directory
COPY --from=builder /app/apps/cms/.next/standalone ./
COPY --from=builder /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=builder /app/apps/cms/public ./apps/cms/public
COPY --from=builder /app/apps/cms/src/migrations-compiled ./apps/cms/src/migrations

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/cms/server.js"]
