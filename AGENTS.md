# AGENTS.md

Operating instructions for any agent — human or AI — working in this repository.
This file is the **feedforward** half of the harness: everything an agent needs
to know before starting, so that it does not have to guess and does not have to
ask.

This file is living. Every time a human corrects agent work, the correction is
treated as a defect in *this file* (or in a spec), not as a one-off fix. See
[docs/feedback-loop.md](./docs/feedback-loop.md).

---

## 1. The prime directives

1. **No spec, no code.** Every change to behaviour starts from a numbered spec
   in `docs/specs/`. If no spec covers the work, write one and get it approved
   first. Refactors, tooling and documentation are exempt.
2. **Specs are immutable.** Never edit a spec after it is written — not even to
   fix a typo. If the requirement changed, write a new numbered spec that
   supersedes the old one.
3. **Red before green.** Never write production code without a failing test
   that demands it.
4. **One slice, one pull request.** A pull request implements one spec, end to
   end, through every layer.
5. **Stop and ask rather than guess.** If a spec is ambiguous, escalate. An
   agent that never asks is not autonomous, it is unsupervised. See §7.

---

## 2. Repository map

```
apps/
  api/          Hono server, Drizzle schema and migrations, integration tests
  web/          React + Vite client, components, hooks, component tests
packages/
  contracts/    Zod schemas, generated OpenAPI types, MSW handlers, factories
  config/       Shared tsconfig, Biome and Tailwind presets
e2e/            Playwright journeys
docs/           Specs, ADRs, strategy documents
.github/        Workflows, pull request template
```

`packages/contracts` is the single source of truth for the shape of the API.
Nothing in `apps/web` may define its own idea of what a `Todo` is.

---

## 3. Commands

| Task | Command |
|---|---|
| Install | `bun install` |
| Everything, dev mode | `bun dev` |
| Typecheck | `bun typecheck` |
| Lint and format | `bun lint` / `bun format` |
| Unit + component tests | `bun test:unit` |
| Integration tests (Testcontainers) | `bun test:integration` |
| End-to-end tests | `bun test:e2e` |
| Regenerate contracts, client and mocks | `bun gen` |
| Create a migration | `bun db:generate` |
| Apply migrations | `bun db:migrate` |
| Full local gate (what CI runs) | `bun verify` |

After changing any Zod schema in `packages/contracts`, **always run `bun gen`**
and commit the generated output. Stale generated files are a review finding.

---

## 4. The loop

The full version is in [docs/workflow.md](./docs/workflow.md). The short version,
for one slice:

1. Read the spec. Restate the acceptance criteria as a checklist in the pull
   request description.
2. **Contract** — add or extend the Zod schema in `packages/contracts`.
   Typecheck now fails downstream. That is the first red.
3. **Domain** — failing unit test for the pure logic, then the implementation.
4. **Persistence and transport** — failing integration test against real
   Postgres, then the migration, repository method and route handler.
5. `bun gen` — regenerate the client and MSW handlers from the schema.
6. **Interface** — failing component test with MSW, then the hook, then the
   components.
7. **Journey** — one failing Playwright test, then make it pass.
8. Refactor at each green. Never refactor at red.
9. Capture before and after screenshots for any visible change.
10. `bun verify`, then open the pull request.

---

## 5. Code conventions

**Components** are small and do one thing. A component either renders markup or
orchestrates children — not both plus data fetching. Side effects, subscriptions
and server state live in hooks (`useTodos`, `useMoveTodo`), never inline in a
component body.

**Server state** belongs to TanStack Query. Client state (open dialogs, draft
text, filters) belongs to `useState` or a small Zustand store. Do not mirror
server data into client state; that is the bug TanStack Query exists to prevent.

**Validation happens once, at the boundary.** Parse the request with Zod in the
route handler and pass the parsed, typed value inward. Inner layers trust their
inputs and never re-validate. Types are inferred from schemas with
`z.infer`; never hand-write a type that duplicates a schema.

**Deep modules.** Prefer a small interface over a large one, hiding a
substantial implementation. `generateKeyBetween(a, b)` is the model: two
arguments, one return value, the entire ordering strategy hidden behind it. A
module whose interface is as complex as its implementation is not pulling its
weight.

**Dependencies point inward.** Domain logic imports nothing from Hono, Drizzle,
React or the network. It is plain TypeScript, testable in milliseconds.

**Errors are values at the domain boundary.** Domain code returns typed failures;
the route handler maps them to HTTP status codes in one place. Do not throw
across layers to signal expected conditions.

**Never access a Drizzle table outside a repository.** Queries live in
`apps/api/src/repositories`. This keeps the persistence invariants enforceable
in one place.

---

## 6. Testing rules

Follow the pyramid — see [docs/testing-strategy.md](./docs/testing-strategy.md).

- Test behaviour through public interfaces, not implementation details.
- Never assert on a CSS class, a test id where a role would do, or an internal
  function call. Query by role and accessible name.
- Integration tests run against **real Postgres** in Testcontainers with
  migrations applied. Never mock the database.
- Component tests use MSW handlers **generated from the contract**. Never
  hand-write a mock response shape.
- Test data comes from typed factories in `packages/contracts` backed by faker.
  Never construct a fixture object literal inline.
- Every error path in a spec gets a test. A slice with only a happy-path test is
  incomplete.
- A flaky test is a broken test. Fix it or delete it; never retry it.

---

## 7. When to stop and ask

Escalate to a human rather than guessing when:

- The spec is ambiguous, self-contradictory, or silent on a case you hit.
- The change would alter the public API contract in a breaking way.
- The change requires a destructive migration (dropping or narrowing a column).
- A test is failing for a reason you do not understand, and making it pass would
  require changing the assertion.
- The work turns out to need more than one spec, or the diff exceeds ~400 lines.
- Anything touching secrets, deployment configuration or branch protection.
- You reach a decision that meets the ADR criteria in
  [docs/adr/](./docs/adr/README.md) and no accepted ADR covers it. Commit a
  `Proposed` ADR with the realistic options and a recommendation, on its own and
  before any code that depends on it, push it to the draft pull request and tell
  the human. You may then implement the recommended option in the same pull
  request so the human can see what it entails, but it must not merge until a
  human accepts the ADR. Do not pick a default and explain it afterwards.

Escalating correctly is a success, not a failure. It is one of the measured
metrics in [docs/roadmap.md](./docs/roadmap.md).

---

## 8. Pull request rules

- Conventional commit title: `feat(api): add move endpoint`.
- Body follows [the template](./.github/pull_request_template.md), including the
  spec number and the acceptance-criteria checklist.
- Before and after screenshots for any visible change; a short video for
  interaction changes such as drag and drop.
- Keep the diff under roughly 400 lines. If it is larger, it was more than one
  slice.
- Generated files are committed, never hand-edited.
- Address every CodeRabbit finding: fix it, or reply explaining why not.

---

## 9. What not to do

- Do not merge a dependency without an accepted ADR. See
  [docs/adr/](./docs/adr/README.md).
- Do not mark an ADR `Accepted` yourself without a human's explicit approval of
  that ADR. Approving the pull request as a whole does not count.
- Do not edit a spec. Supersede it.
- Do not disable, skip or `.only` a test to get a green build.
- Do not weaken a gate (lint rule, coverage threshold, type strictness) to make
  a change fit. Raise it as a finding instead.
- Do not change files in `.github/workflows/`, branch protection, or deployment
  configuration as part of a feature slice.
- Do not introduce a state management library for server state.
- Do not hand-write types, mocks or clients that `bun gen` produces.
