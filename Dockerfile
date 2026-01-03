FROM node:20-alpine AS base

# Corepack and global tools in standard paths
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g prisma@7.2.0 tsx --unsafe-perm

# Dummy DATABASE_URL for build time validation
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV NEXT_TELEMETRY_DISABLED 1

# --- Dependencies Stage ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma generate
RUN pnpm build

# --- Runner Stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Ensure we keep the tools in the path
ENV PATH="/usr/local/bin:$PATH"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Assets and standalone build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Fix permissions for the nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
