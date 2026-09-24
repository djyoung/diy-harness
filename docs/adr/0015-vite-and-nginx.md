# 0015 — Vite for the web build, nginx to serve it

**Status:** Accepted · **Date:** 2026-09-17

## Context

`apps/web` needs a development server with hot reload and a production build,
and the production build needs something to serve it from a container. The
README names Vite as part of the frontend stack, but no ADR records it, and
nothing yet says how the built files reach a browser. The container has to be
multi-stage, non-root and minimal ([local development](../local-development.md)),
and it has to be the same image locally, in the end-to-end suite and on Railway
([ADR 0009](./0009-hosting.md)).

## Decision

Vite is the web development server and bundler, pinned to an exact version.
The production image builds the static bundle with Vite and serves it from
`nginxinc/nginx-unprivileged`, which runs as a non-root user on port 8080.
`apps/web/nginx.conf` falls back to `index.html` for unknown paths so that
client-side routes work, caches hashed assets forever and revalidates
everything else.

## Consequences

The runtime image contains static files and a web server, and no JavaScript
runtime. There is no application code on the serving path to test, patch or
keep in step with Bun.

Development and production serve the files differently: Vite serves them in
development and nginx in production. The end-to-end suite runs against the
production images (`docker-compose.test.yml`), so a difference between the two
fails a test rather than a deploy.

This decision does not cover how the browser reaches the API. That choice is
either the web server proxying `/api` to the API service, or the client calling
the API's own origin with CORS. It belongs to the first slice that makes a
request, spec 0001, and will be recorded then.

## Alternatives considered

**A small Bun static file server.** One runtime and one base image across both
applications. But it is our code on the serving path, and it has to handle SPA
fallback, cache headers, content types and range requests correctly. nginx
already does all of that.

**`vite preview`.** Vite's own documentation says it is not a production
server.

**Caddy.** Just as capable, with a shorter configuration. Rejected only
because the maintained nginx image already runs as non-root without any extra
setup, and nginx configuration is better known.
