FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace files + all package.jsons for yarn workspace resolution
COPY package.json yarn.lock turbo.json ./
COPY apps/ui/package.json apps/ui/
COPY apps/api/package.json apps/api/
COPY apps/mana/package.json apps/mana/
COPY apps/highlight/package.json apps/highlight/
COPY packages/ packages/

# Install all dependencies (workspace needs full install)
RUN yarn install --frozen-lockfile

# Copy UI source
COPY apps/ui/ apps/ui/

# Build the UI
RUN yarn turbo run build --filter=ui

# ── Production: serve static files with nginx ──
FROM nginx:alpine

COPY --from=builder /app/apps/ui/dist /usr/share/nginx/html

# SPA fallback
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {\n\
    expires 1y;\n\
    add_header Cache-Control "public, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
