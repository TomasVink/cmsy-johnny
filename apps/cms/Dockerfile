# Build context must be the monorepo root:
#   docker build -f apps/cms/Dockerfile .

# Builder uses Debian-based bun (glibc) so native binaries (esbuild, sharp, etc.)
# resolve correctly. The slim runtime uses node:alpine.
FROM oven/bun:1.3.11 AS builder
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
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=4096"

WORKDIR /app/apps/cms
RUN ./node_modules/.bin/next build

# ── Runtime ───────────────────────────────────────────────────────────────────
# Run with Bun — the standalone output uses bun's .bun/ node_modules format
# which Node.js can't resolve but Bun can.
FROM oven/bun:1.3.11-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# outputFileTracingRoot is set to the monorepo root, so Next.js places server.js
# at apps/cms/server.js inside the standalone directory
COPY --from=builder /app/apps/cms/.next/standalone ./
COPY --from=builder /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=builder /app/apps/cms/public ./apps/cms/public

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 bun apps/cms/server.js"]
