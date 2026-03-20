# Build context must be the monorepo root:
#   docker build -f apps/web/Dockerfile .

FROM oven/bun:1.3.10-alpine AS base

# ── Install dependencies ───────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy workspace manifests so Bun can resolve the full dependency graph
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/payload-types/package.json ./packages/payload-types/

RUN bun install --frozen-lockfile

# ── Build ──────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/apps/web
RUN bun run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM oven/bun:1.3.10-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Use port 3001 to avoid collision with the CMS on 3000
ENV PORT=3001
ENV HOST=0.0.0.0

COPY --from=builder /app/apps/web/build ./build

EXPOSE 3001

CMD ["bun", "./build/index.js"]
