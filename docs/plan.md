# Build plan

The ordered task list to get from an empty repository to the end of Phase 1.
Each numbered item is one pull request unless stated otherwise. Phases and exit
criteria are in [roadmap.md](./roadmap.md).

## Phase 0 — Walking skeleton

Infrastructure first, in the order that lets each step be verified by the one
before it. No feature work until the pipeline is green.

1. **Repository bootstrap.** `git init`, Bun workspaces, Turborepo, shared
   tsconfig and Biome config in `packages/config`, `.gitignore`,
   `.env.example`. Exit: `bun install` and `bun typecheck` pass on empty
   packages.
2. **Docker and devcontainer.** Dockerfiles for both applications, the two
   compositions, `.devcontainer`. Exit: `docker compose up` serves a health
   endpoint.
3. **Contracts and generation.** `packages/contracts` with the `Todo` schema,
   `@hono/zod-openapi` wiring, `bun gen` producing the OpenAPI document, the
   typed client, MSW handlers and faker factories. Exit: `bun gen` is
   idempotent and its output is committed.
4. **Database and migrations.** Drizzle configured, the `todos` table, the first
   migration, `db:migrate`, `db:reset`, `db:seed`. Comes after contracts because
   the seed uses the factories from item 3. Exit: migrations apply to an empty
   database and the seed runs.
5. **Test harness.** Vitest projects, Testcontainers setup, RTL and MSW setup,
   Playwright, coverage thresholds. Exit: one trivial test at each level runs
   green.
6. **Local gates.** Lefthook pre-commit and pre-push, commitlint, gitleaks.
   Exit: a bad commit message and a formatting violation are both rejected.
7. **Continuous integration.** The workflow from [ci-cd.md](./ci-cd.md), all
   jobs in parallel, Turborepo caching. Exit: a pull request runs every job.
8. **Deployment.** Railway project, environment variables, migrate-then-release,
   smoke test, pull request environments. Exit: a merge deploys and the smoke
   test passes against the deployed URL.
9. **Branch protection and review.** Required checks, one approval, squash only,
   linear history, `.coderabbit.yaml` with the initial rubric. Exit: `main`
   cannot be pushed to directly, including by an administrator.
10. **Spec 0001 — list todos.** The first real slice, through every layer.
    Exit: the deployed application renders a seeded list.
11. **Spec 0002 — API error responses.** The error contract and its single
    mapping module. Exit: every status code in the contract has a test.

At this point the shape is proven end to end and everything after it is filling
it in.

## Phase 1 — Core CRUD

One slice per pull request, in this order. The order is chosen so that each
slice can be exercised by hand using the ones before it.

12. **Spec 0003 — create a todo.** Introduces append-key generation and the
    first optimistic update.
13. **Spec 0004 — complete and reactivate.** Introduces `PATCH` and the
    optimistic rollback test that every later slice copies.
14. **Spec 0005 — edit a todo's body.** Introduces `PUT` versus `PATCH`
    semantics and inline editing.
15. **Spec 0006 — delete a todo.** Introduces destructive confirmation.
16. **Spec 0007 — move a todo.** The hardest slice: fractional key generation
    with property tests, the move endpoint, drag and drop with keyboard support.
    Deliberately last, so it lands on a mature harness.

Then, before declaring Phase 1 complete: re-read every finding from pull
requests 10 to 16 together, group them, and fix the largest group at its source.
That review is the first real exercise of
[the feedback loop](./feedback-loop.md), and its output is the version of
`AGENTS.md` that Phase 2 builds on.

## Notes

The unusual thing about this plan is that nine of the first eleven items are
scaffolding. That is intentional. In a normal project the ratio would be
indefensible; here the scaffolding *is* the product, and the todo list exists to
give it something to be scaffolding for.
