# 0018 — Postgres driver and migration runner

**Status:** Proposed · **Date:** 2026-09-23

## Context

[ADR 0002](./0002-backend-stack.md) chose Drizzle, but Drizzle is an ORM layer
over a driver, and it does not choose the driver. Build-plan item 3 (database and
migrations) cannot start until two things are settled, because each adds a
dependency and shapes every later slice:

1. **Which Postgres driver** the API and the integration tests use.
2. **How migrations are applied**, both locally and at deploy time.

The second is constrained by decisions already made. The production API image is
a single bundled file with no `node_modules`
([`apps/api/Dockerfile`](../../apps/api/Dockerfile)). The deployment pipeline runs
migrations first and only then releases ([ci-cd.md](../ci-cd.md)). Integration
tests must apply the real migrations to a Testcontainers Postgres
([ADR 0006](./0006-testing-stack.md)). `drizzle-kit` is needed at development
time regardless, to generate migration SQL from the schema (`bun db:generate`).

## Decision

**Driver: Bun's built-in Postgres client, through `drizzle-orm/bun-sql`.**

**Runner: the programmatic migrator, `migrate()` from
`drizzle-orm/bun-sql/migrator`, called from a small `apps/api/src/db/migrate.ts`
entry point.** `bun db:migrate`, the integration-test setup and the deploy step
all call that one function. `drizzle-kit` is a development dependency used only
for `db:generate`.

New dependencies: `drizzle-orm` (runtime), `drizzle-kit` (dev). No separate
driver package.

## Consequences

**No extra driver dependency.** The client ships with Bun, which the project
already pins, so the runtime dependency list grows by one package instead of two.

**One migration path.** Because the same function runs everywhere, a migration
that passes the integration tests is, by construction, the code path that runs in
production. The alternative, invoking the `drizzle-kit migrate` CLI, would need
the CLI and its dependencies present in the runtime image or a separate migration
image, which contradicts the bundle-only runtime stage.

**The migration entry point is bundled like the server**, and the generated
`.sql` files and their journal must be copied into the runtime image beside it.
That copy step is part of item 3 and the deployment item.

**Risk: the Bun adapter is the youngest of the three Drizzle offers.** If it
lacks something the slices need, most likely a transaction behaviour that the
move endpoint relies on, the fallback is `postgres-js`, which is a change of one
import and one dependency. Item 3 verifies transactions and the migrator against
a real Postgres before anything is built on top, and a failure there is reported
as a superseding ADR, not worked around.

## Alternatives considered

**`postgres` (postgres.js) with `drizzle-orm/postgres-js`.** The mature choice
and the most likely to behave identically across runtimes, which would matter if
the project left Bun. It costs one additional runtime dependency to do what the
runtime already does. Reasonable, and the named fallback.

**`pg` (node-postgres) with `drizzle-orm/node-postgres`.** The most widely
deployed driver, but it is written for Node's I/O model, adds native-binding
optional dependencies, and gives nothing here that the other two do not.
Rejected.

**Running `drizzle-kit migrate` as the deploy step.** Simplest to type, but it
puts the CLI in the deploy path and the runtime image, and it is a different
code path from the one the integration tests exercise. Rejected for that
divergence.

**`drizzle-kit push`.** Applies the schema directly with no migration files.
Rejected outright: it removes the reviewable SQL that
[ADR 0002](./0002-backend-stack.md) chose Drizzle to get.
