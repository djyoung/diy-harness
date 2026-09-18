# 0003 — TanStack Query for server state

**Status:** Accepted · **Date:** 2026-09-17

## Context

The frontend needs to read and mutate todos. The question raised was whether to
use a state management library or TanStack Query.

## Decision

TanStack Query owns all server state. Genuinely client-side state — dialogs,
draft text, filters — stays in `useState`, or a small Zustand store if it ever
needs to be shared widely.

## Consequences

Server state is not client state: it is a cache of something owned elsewhere,
which can go stale, fail and need retrying. Treating it as client state means
reimplementing caching, invalidation, retry and rollback by hand, and getting
them subtly wrong.

Optimistic updates matter here specifically. Completion toggles and drag
reordering must feel instant, and both must roll back correctly on failure —
TanStack Query provides the snapshot-and-restore mechanism directly, and the
rollback path is explicitly tested.

The cost is that two places hold state, so the boundary must be understood:
never copy server data into client state.

## Alternatives considered

**Zustand with a hand-rolled fetch layer.** Fewer dependencies, but every cache
and rollback behaviour becomes code we own and test ourselves.

**RTK Query.** Capable and with good code generation, but it brings Redux
conventions that are disproportionate to a single-entity CRUD application.
