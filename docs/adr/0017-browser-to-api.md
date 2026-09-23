# 0017 — The browser reaches the API through a same-origin proxy

**Status:** Proposed · **Date:** 2026-09-23

## Context

The web application is a static single-page app served by a web server, and the API
is a separate service. The first slice that makes a request from one to the other is
[spec 0001](../specs/0001-list-todos.md). The decision on how the browser reaches
the API was deferred to that slice when the web server was chosen.

Three constraints shape it:

- **One image per application in every environment.**
  [Local development](../local-development.md) requires that what runs locally is
  what runs in production, and the end-to-end suite runs the production images.
  [ADR 0009](./0009-hosting.md) adds per-pull-request preview environments, whose
  addresses differ each time. A web image that contains an API address, or an
  allowed-origins list, is not the same image everywhere.
- **The API contract is fixed.** Spec 0001 is approved and immutable, and its
  contract is `GET /todos`. Later specs follow the same pattern, so the API's routes
  are not under a prefix.
- **There is no authentication in v1** ([ADR 0007](./0007-no-auth.md)), so there are
  no cookies or credentials to complicate either option.

## Decision

The browser only talks to the web server. The web server proxies requests under
`/api/` to the API service and removes the `/api` prefix, so the API keeps serving
`/todos`, `/health` and the rest exactly as the specs write them.

The client calls relative URLs such as `/api/todos`. The built web image therefore
contains no API address, and one image runs unchanged in development, end-to-end
tests and every deployed environment. The API's address is set where the web image
runs, as an environment variable read by the web server's configuration.

In development, Vite's `server.proxy` does the same job as the web server does in
production, and the development and end-to-end proxies are two implementations of
one rule: `/api/*` goes to the API with the prefix removed.

## Consequences

There is no cross-origin traffic, so no CORS middleware, no preflight requests for
JSON `PATCH` and `DELETE` calls, and no allowed-origins list to keep correct as
preview addresses change.

The web server is now on the request path for every API call. It adds a hop, and
timeouts, body-size limits and response buffering become its concern. The web
container must be able to reach the API, not only the browser, and the API's address
differs by environment: the Compose service name locally and the platform's private
network address when deployed.

Development and production use different proxies, Vite and the web server. The
end-to-end suite runs the production images, so a difference between them fails a
test and not a deploy.

The web application depends on the API being reachable at runtime, so the web
container's health is partly the API's.

Where the API's port is published, the API can still be called directly. Nothing in
this decision removes that.

### Open questions

These are for the reviewer to settle before this is accepted.

- **The generated client's base URL.** How the contract-first client and the MSW
  handlers from [ADR 0005](./0005-contract-first-codegen.md) set their base URL,
  and whether `/api` fits the generated code without manual changes.
- **Upstream configuration on the deployment platform.** How the API's address is
  supplied to the web container on Railway, and what happens on Fly.io later.
- **Startup ordering.** Nginx resolves the upstream host name when it starts, and
  fails if the API is not resolvable. Compose can order the two, and a platform may
  not.
- **Whether end-to-end tests call the API directly**, for example to set up data.
  If they do, the test stack must keep publishing an API port, on one that does not
  clash with the development stack's.

## Alternatives considered

**Mount the API under `/api`.** The same-origin result without a prefix-stripping
proxy rule. It changes the API's routes, which contradicts the contract in spec
0001, and specs are immutable, so it would mean superseding that spec and every
later one that names a route.

**CORS against the API's own origin.** The web server stays a plain file host, and
the two services deploy independently. But the client needs the API's address, and
if that is built in, the image differs per environment. Avoiding that needs runtime
configuration injected into the page, and the allowed-origins list has to follow
each preview environment's address. Preflight requests cost a round trip, and CORS
failures are hard to diagnose, since the browser hides the reason.

**The API serves the static files.** One container and one origin, with no proxy
and no CORS. It couples the frontend and API deployments and puts application code
on the path that serves static files, which the web server decision was made to
avoid.
