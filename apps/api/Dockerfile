# syntax=docker/dockerfile:1
# Build context: the repository root (see docker-compose.yml).

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

# Development: source is bind-mounted by docker-compose.yml, and Bun restarts
# on change.
FROM deps AS dev
COPY packages packages
COPY apps/api apps/api
WORKDIR /app/apps/api
USER bun
EXPOSE 3000
CMD ["bun", "run", "dev"]

# Build: bundle the server and its dependencies into one file.
FROM deps AS build
COPY packages packages
COPY apps/api apps/api
WORKDIR /app/apps/api
RUN bun run build

# Runtime: the bundle only, no node_modules, running as the unprivileged user
# the Bun image provides.
FROM oven/bun:${BUN_VERSION}-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=bun:bun /app/apps/api/dist/index.js ./index.js
USER bun
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/health" || exit 1
CMD ["bun", "index.js"]
