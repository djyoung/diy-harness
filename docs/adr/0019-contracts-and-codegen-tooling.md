# 0019 — Contract layout and code generation tooling

**Status:** Proposed · **Date:** 2026-09-23

## Context

[ADR 0005](./0005-contract-first-codegen.md) decided that Zod schemas in
`packages/contracts` are the single source of truth, and that `bun gen` derives
the OpenAPI document, then the typed client, then the MSW handlers.
[ADR 0002](./0002-backend-stack.md) chose `@hono/zod-openapi` to produce the
document, and [ADR 0006](./0006-testing-stack.md) chose faker behind typed
factories. None of them says:

1. **Where the route definitions live.** `@hono/zod-openapi` describes a route
   (method, path, request and response schemas) with `createRoute`. The
   OpenAPI document is built from those definitions, not from the schemas
   alone.
2. **Which tool turns the document into a client and MSW handlers.**
3. **How the factories are built.**

Build-plan item "contracts and generation" cannot start until these are
settled. Each one adds a dependency or sets a pattern that every later slice
copies.

## Decision

**Route definitions live in `packages/contracts`, beside the schemas.** Each
resource has a `schema.ts` and a `routes.ts`. `bun gen` builds the OpenAPI 3.1
document by registering those routes on a bare `OpenAPIHono` registry. It never
imports the API application. `apps/api` imports the route definitions and only
attaches handlers:

```ts
app.openapi(listTodosRoute, async (c) => c.json(await todos.list(), 200));
```

**Orval generates the client, the TanStack Query hooks and the MSW handlers**
from the committed `openapi.json`, using its `react-query` client, the `fetch`
HTTP client and `msw` mocks. `apps/web` hooks wrap the generated ones
(`useTodos` calls `useGetTodos`) so that components depend on our names, not on
generated ones.

**Factories are hand-written** with `@faker-js/faker` and typed with `z.infer`,
for example `buildTodo(overrides)`. Tests pass factory output to the generated
handlers (`getGetTodosMockHandler([buildTodo()])`). A test that relies on
Orval's own random mock data is a review finding.

**The package has separate entry points**, so that the API never bundles
React, TanStack Query, MSW or faker:

| Entry point | Contents | Imported by |
|---|---|---|
| `@diy-harness/contracts` | Schemas, route definitions | api, web |
| `@diy-harness/contracts/client` | Generated fetch client and query hooks | web |
| `@diy-harness/contracts/msw` | Generated MSW handlers | web tests |
| `@diy-harness/contracts/factories` | Hand-written factories | all tests |

`bun gen` runs two steps in order: write `openapi.json` from the routes, then
run Orval against it. Both outputs are committed, as ADR 0005 requires.

New dependencies:

- `packages/contracts`: `zod` and `@hono/zod-openapi`, which ADR 0002 already
  covers.
- `packages/contracts`, development only: `orval`, which this ADR adds, and
  `@faker-js/faker`, which ADR 0006 covers.
- Peers of the generated code: `@tanstack/react-query` (ADR 0003) and `msw`
  (ADR 0006).

## Consequences

**The dependency graph points one way.** `api` and `web` both depend on
`contracts`, and `contracts` depends on neither. Generating the document does
not need a database connection, environment variables or the API's
dependencies.

**One generator covers the client, the hooks and the MSW handlers**, so the
repository contains no generator code of its own. The cost is that the shape of
the generated code, such as hook names like `useGetTodos` and query keys like
`['/todos']`, is Orval's rather than ours. The wrapper hooks in `apps/web` keep
those names out of components. Query keys used for invalidation and optimistic
updates come from Orval's generated `getGetTodosQueryKey()` and are never
written by hand.

**Factories can enforce domain rules that schemas cannot**: a valid fractional
position key, `modifiedAt` no earlier than `createdAt`, and a body within the
length limits. Randomly generated mocks are only schema-valid. The cost is one
small builder per entity, written by hand.

**Orval's own faker-based defaults still appear in the generated handlers.**
They are used only when a test passes no data. The convention above keeps them
out of assertions. A later lint rule could enforce it.

**The route definitions describe the HTTP layer from inside the contracts
package.** A new endpoint touches `contracts/routes.ts` before `apps/api`,
which matches step 1 of the [workflow](../workflow.md): the contract is red by
typecheck before any handler exists.

## Alternatives considered

**Route definitions in `apps/api`.** Keeps `contracts` to pure schemas, with
the routes next to their handlers. But `bun gen` would have to import the API
application to read its document, so importing the app must never open a
connection or read secrets. The generated output would also flow from `api`
back into `contracts`, making the package that is supposed to be the source of
truth partly an output of the API. Rejected.

**Hey API `openapi-ts`.** A clean SDK and a TanStack Query plugin, and actively
developed. Its MSW generation is less mature, so we would probably have to
write and maintain a small MSW generator in this repository. Rejected for that
extra code. It is the closest alternative.

**`openapi-typescript` with `openapi-fetch` and `openapi-msw`.** Generates
types only, with a very small runtime. The query hooks would be written by
hand, and the MSW handlers would be hand-written but type-checked against the
document rather than generated. That is weaker than ADR 0005's "handlers come
from the same document". Rejected.

**Hono RPC client (`hc<AppType>`).** No client generation at all, because types
come from the API app's type. But `apps/web` would import from `apps/api`
rather than from `contracts`, which contradicts ADR 0005, and MSW handlers would
still need one of the generators above. Rejected.

**Orval's generated faker mocks as the factories.** No builders to write, but
the values are schema-valid only, and a test cannot state just the field that
matters to it. Rejected.
