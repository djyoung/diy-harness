# syntax=docker/dockerfile:1
# Build context: the repository root (see docker-compose.test.yml).

ARG BUN_VERSION=1.4.2

# Dependencies. Every workspace manifest is copied because the lockfile covers
# the whole workspace; add new workspaces here.
FROM oven/bun:${BUN_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/contracts/package.json packages/contracts/
RUN bun install --frozen-lockfile

# Build: the static production bundle.
FROM deps AS build
COPY packages packages
COPY apps/web apps/web
WORKDIR /app/apps/web
RUN bun run build

# Runtime: static files behind nginx, as an unprivileged user on port 8080.
# See ADR 0015.
FROM nginxinc/nginx-unprivileged:1.30-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
