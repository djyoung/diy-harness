# Architecture Decision Records

One file per significant decision, numbered and immutable once accepted. A
decision is reversed by writing a new record that supersedes the old one, never
by editing history — the value of the archive is that it records what was
believed at the time, including what turned out to be wrong.

Write a new ADR when adding a dependency, changing a boundary, or choosing
between approaches where the rejected option was genuinely defensible.

| # | Decision | Status |
|---|---|---|
| [0001](./0001-monorepo.md) | Bun workspaces monorepo with Turborepo | Accepted |
| [0002](./0002-backend-stack.md) | Hono, Zod and Drizzle | Accepted |
| [0003](./0003-server-state.md) | TanStack Query for server state | Accepted |
| [0004](./0004-fractional-indexing.md) | Fractional indexing for ordering | Accepted |
| [0005](./0005-contract-first-codegen.md) | Contract-first code generation | Accepted |
| [0006](./0006-testing-stack.md) | Vitest, Testcontainers and Playwright | Accepted |
| [0007](./0007-no-auth.md) | No authentication in v1 | Accepted |
| [0008](./0008-hard-delete.md) | Hard delete, no soft delete | Accepted |
| [0009](./0009-hosting.md) | Railway now, Fly.io and Neon later | Accepted |
| [0010](./0010-ai-review.md) | CodeRabbit now, Claude Code Action in Phase 2 | Accepted |
| [0011](./0011-immutable-specs.md) | Specs are numbered and immutable | Accepted |
| [0012](./0012-public-repository.md) | Public repository | Accepted |
