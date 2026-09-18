# diy-harness

A deliberately small todo application, used as the subject of a much larger
experiment in **harness engineering**: building the feedforward and feedback
systems that let an AI agent pick up work and complete it reliably.

The app is not the point. The app is small on purpose, so that the interesting
work is the scaffolding around it — specs, tests, gates, review, deployment and
the loop that turns each human correction into a permanent improvement to the
harness.

## What it does

A single shared todo list. Create, read, update, complete, delete and reorder
todos. No authentication, no multi-user support.

## Stack

| Layer | Choice |
|---|---|
| Monorepo | Bun workspaces + Turborepo |
| Frontend | React + TypeScript + Vite + Tailwind + shadcn/ui + dnd-kit |
| Server state | TanStack Query |
| Backend | Hono + Zod (`@hono/zod-openapi`) |
| Persistence | Postgres + Drizzle ORM |
| Testing | Vitest, React Testing Library, MSW, Testcontainers, Playwright |
| Hooks | Lefthook |
| CI | GitHub Actions |
| Hosting | Railway (Fly.io + Neon planned) |
| AI review | CodeRabbit |

## Where to start

- [`AGENTS.md`](./AGENTS.md) — how to work in this repository. Read first.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — structure, boundaries and invariants.
- [`docs/workflow.md`](./docs/workflow.md) — the vertical slice loop.
- [`docs/roadmap.md`](./docs/roadmap.md) — phases and autonomy gates.
- [`docs/adr/`](./docs/adr/) — why each significant decision was made.
- [`docs/specs/`](./docs/specs/) — numbered, immutable feature specifications.

## Status

Phase 0 — documentation complete, no code written yet.
