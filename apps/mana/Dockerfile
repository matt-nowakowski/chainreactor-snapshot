FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace files + all package.jsons for yarn workspace resolution
COPY package.json yarn.lock turbo.json ./
COPY apps/ui/package.json apps/ui/
COPY apps/api/package.json apps/api/
COPY apps/mana/package.json apps/mana/
COPY apps/highlight/package.json apps/highlight/
COPY packages/ packages/

# Install all dependencies
RUN yarn install --frozen-lockfile

# Copy mana source
COPY apps/mana/ apps/mana/

# Build mana
RUN yarn turbo run build --filter=mana

# ── Production ──
FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/mana/package.json apps/mana/
COPY packages/ packages/

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/apps/mana/dist apps/mana/dist
COPY --from=builder /app/apps/mana/knexfile.ts apps/mana/knexfile.ts
COPY --from=builder /app/apps/mana/migrations apps/mana/migrations

WORKDIR /app/apps/mana

EXPOSE 3000
CMD ["sh", "-c", "node --experimental-strip-types --no-warnings=ExperimentalWarning ./node_modules/.bin/knex migrate:latest && node dist/src/index.js"]
