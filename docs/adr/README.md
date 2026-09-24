# Architecture Decision Records

One file per significant decision, numbered and immutable once accepted. A
decision is reversed by writing a new record that supersedes the old one, never
by editing history — the value of the archive is that it records what was
believed at the time, including what turned out to be wrong.

Write a new ADR when adding a dependency, changing a boundary, or choosing
between approaches where the rejected option was genuinely defensible.

## Lifecycle

An ADR has one of four statuses.

| Status | Meaning |
|---|---|
| `Proposed` | Written, not yet approved. Still editable. No code that depends on it may be written. |
| `Accepted` | Approved by a human. Immutable from this point. |
| `Rejected` | Considered and turned down. Only merged when a human asks for it. |
| `Superseded by NNNN` | Replaced by a later ADR. The text is left as it was. |

### When an ADR must be approved

The rule is that a decision is approved before code depends on it, never
explained afterwards. How depends on when the decision is found.

**Foreseeable decisions**, such as the tooling and dependency choices of a
planned item, get an ADR-only pull request. It contains the ADR and its index
row and nothing else. It is opened with the ADR `Proposed`, approved as
described below, and merged with the ADR `Accepted` before the implementation
branch starts.

**Decisions discovered mid-work** stop the work. The agent commits a `Proposed`
ADR and its index row to the draft pull request it is already working in, writes
no code that depends on the decision, and asks. The options and a recommendation
go in the ADR itself.

### Approving a proposed ADR

A human approves an ADR by saying so explicitly, in either of two ways:

- **On the pull request**, in a review comment or a reply.
- **In conversation with the agent**, for example by saying that the ADR looks
  good.

The agent then sets the status to `Accepted` in its own commit and continues.
The commit links the approving comment or, for an approval given in
conversation, quotes it and says so. The approval must be about the ADR itself.
A pull request approval covers the whole diff and is not an approval of the ADR.

A pull request must not merge with an ADR still `Proposed`.

### If a proposal is changed, turned down or deferred

- **Changes requested.** Edit the ADR in place while it is `Proposed`, push, and
  ask again.
- **A listed alternative is chosen instead.** Rewrite the ADR around the chosen
  option and move the original proposal into "Alternatives considered". The
  rejection is recorded inside the accepted ADR.
- **The idea is turned down with no replacement.** Discard the ADR and any code
  that depended on it. Merge it as `Rejected` only if a human asks, for example
  to stop the same idea being proposed again.
- **The decision is deferred.** It is still needed, but not yet, for example
  because the plan was reordered. Close the pull request unmerged, with a
  comment saying it is deferred rather than rejected, why, and when it will be
  revisited. The ADR gets no status and no index row, and no code may depend on
  it. When the work resumes, propose it afresh, numbered as below, and
  link the closed pull request. The earlier text is a starting point, not an
  approval, because the context it was written in may have changed.

A closed ADR pull request always carries a comment saying which of these
outcomes applies. Without one, the next reader cannot tell a rejected idea from
a postponed one.

### Numbering

ADR numbers are contiguous, with no gaps. The ADR that merges first takes the
next number after the highest one on `main`.

- **While writing**, number a new ADR as the next after the highest ADR merged
  on `main`, even if an open pull request already uses that number.
- **Before merging**, check `main` again. If another ADR has taken the number in
  the meantime, renumber this one to the next free number: the file name, its
  heading, its index row and any links to it.
- **Closed proposals reserve nothing.** A discarded or deferred ADR never
  merged, so its number goes to whichever ADR merges next.
- **A merged ADR is never renumbered.**

## Index

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
| [0013](./0013-biome.md) | Biome for linting and formatting | Accepted |
| [0014](./0014-typescript-7.md) | TypeScript 7 | Accepted |
| [0015](./0015-vite-and-nginx.md) | Vite for the web build, nginx to serve it | Accepted |
