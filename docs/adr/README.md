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
| `Proposed` | Written, not yet approved. Still editable. Code that depends on it may be written in the same draft pull request, but nothing may merge while the ADR is `Proposed`. |
| `Accepted` | Approved by a human. Immutable from this point. |
| `Rejected` | Considered and turned down. Only merged when a human asks for it. |
| `Superseded by NNNN` | Replaced by a later ADR. The text is left as it was. |

### When an ADR must be approved

The rule is that a decision is approved before it is merged, never explained
afterwards. The ADR and the code that depends on it are proposed together, in the
same draft pull request, so that the reviewer sees what the decision costs
alongside the reasoning for it. Nothing merges until the ADR is `Accepted`.

The agent, on finding a decision that meets the ADR criteria:

1. **Writes the ADR first**, with the realistic options, a short code example of
   each where that helps, and a recommendation. It commits the ADR and its index
   row on their own, pushes them to the draft pull request and tells the human,
   before writing any code that depends on the decision. If the human has
   already stated a preference, the recommendation is that preference.
2. **Implements the recommended option** in later commits. The ADR commit is
   kept separate so that either can be dropped without the other. The pull
   request description says what would change if a different option were chosen.
3. **Asks for approval** as described below, and does not merge before it.

The human can redirect at any point after step 1, including before the
implementation exists. The agent does not wait for a reply to continue, but it
never treats the absence of one as approval.

Some decisions still stop the work first, because trying them is not harmless:
those covered by [AGENTS.md section 7](../../AGENTS.md), such as a destructive
migration, or anything touching secrets, deployment configuration or branch
protection.

**A decision-only pull request is still available**, and is the better choice
when a decision affects several upcoming slices, or when the human wants to decide
before any work starts. It contains the ADR and its index row and nothing else,
and is merged with the ADR `Accepted` before any implementation branch starts.

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

- **Changes requested.** Edit the ADR in place while it is `Proposed`, adjust the
  code to match, push, and ask again.
- **A listed alternative is chosen instead.** Rewrite the ADR around the chosen
  option and move the original proposal into "Alternatives considered". The
  rejection is recorded inside the accepted ADR. Rework the code to the chosen
  option, and drop commits that implemented the rejected one.
- **The idea is turned down with no replacement.** Discard the ADR and any code
  that depended on it. Merge it as `Rejected` only if a human asks, for example
  to stop the same idea being proposed again.
- **The decision is deferred.** It is still needed, but not yet, for example
  because the plan was reordered. Close the pull request unmerged, with a
  comment saying it is deferred rather than rejected, why, and when it will be
  revisited. The ADR gets no status and no index row, and no code that depends
  on it merges. When the work resumes, propose it afresh, numbered as below, and
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
| [0016](./0016-devcontainer-only-development.md) | Development happens in the devcontainer | Proposed |
