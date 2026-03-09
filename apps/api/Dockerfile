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

# Copy API source
COPY apps/api/ apps/api/

# Build the API
RUN yarn turbo run build --filter=api

# ── Production ──
FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/api/package.json apps/api/
COPY packages/ packages/

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/apps/api/dist apps/api/dist

WORKDIR /app/apps/api

EXPOSE 3000
CMD ["node", "dist/src/index.js"]
