# Testing strategy

## The pyramid, and what each level is for

| Level | Tool | Scope | Budget |
|---|---|---|---|
| Unit | Vitest | Pure domain logic, both apps | < 1s total |
| Component | Vitest + RTL + MSW | One component or hook, network mocked | < 10s total |
| Integration | Vitest + Testcontainers | Route → service → repository → real Postgres | < 60s total |
| End-to-end | Playwright | One user journey through the running system | < 3 min total |

Most assertions belong at the bottom. Each level exists to catch a class of bug
the level below it structurally cannot: unit tests cannot catch a wrong SQL
query, integration tests cannot catch a broken drag interaction, end-to-end
tests catch wiring and nothing else efficiently.

## Rules

**Test behaviour, not implementation.** Assert what a user or caller can
observe. Never assert on a CSS class, an internal function call, or a test id
where a role and accessible name would do. A test that breaks during a pure
refactor was testing the wrong thing.

**Never mock the database.** Integration tests run real Postgres in
Testcontainers with migrations applied, one container per suite, each test in a
transaction that rolls back. A mocked repository tests that the mock was called,
which is not a fact about the system.

**Never hand-write a mock response.** MSW handlers are generated from the
OpenAPI document produced by the Zod schemas. A hand-written handler can encode
a response shape the server never sends, which makes the component test actively
misleading.

**Test data comes from factories.** Typed builders in `packages/contracts`,
backed by faker with a fixed seed in CI. `makeTodo({ isComplete: true })` states
what matters to the test and randomises the rest — inline object literals bury
the salient value among six irrelevant ones.

**Every error path in the spec gets a test.** A slice with only a happy path is
not done. Validation failures, not-found, and conflict cases are where the
status-code contract actually lives.

**A flaky test is a broken test.** Fix the race or delete the test. Never add a
retry: a retried test tells you nothing on the run where it mattered.

## Coverage

Thresholds enforced in CI, failing the build when not met:

- `domain/` — 100% line and branch. It is pure, small, and the only place with
  real algorithmic risk.
- `apps/api` overall — 90%.
- `apps/web` overall — 80%.

Coverage is a floor, not a goal. The measure of a good suite here is whether a
deliberately introduced bug is caught, not the percentage.

## Property-based testing

The ordering key generator gets property tests via fast-check. For any valid
pair `a < b`, `generateKeyBetween(a, b)` must sort strictly between them, and
repeated insertion between the same neighbours must never produce a collision or
an unbounded key. Example-based tests confirm the cases you thought of; the
property confirms the ones you did not.

## End-to-end journeys

Deliberately few. One per genuinely distinct user path:

1. Create a todo, see it appear at the end of the list.
2. Complete a todo, reload, see it still complete.
3. Reorder by keyboard, reload, see the new order persisted.
4. Delete a todo, see it gone.

Playwright runs against `docker compose up` — the same images that deploy — and
captures screenshots for pull request evidence as a side effect of the run.

## What we do not test

- Framework behaviour. Do not test that TanStack Query caches.
- Generated code. If `bun gen` is wrong, fix the generator.
- Styling. Visual regression is not worth the maintenance at this size.
