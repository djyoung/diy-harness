# 0004 — Fractional indexing for ordering

**Status:** Accepted · **Date:** 2026-09-17

## Context

Todos are reorderable by drag and drop. The data model carries a `position`
field, and how that field works determines both write cost and correctness under
concurrency.

## Decision

`position` is a text column holding a **fractional index**: an opaque,
lexicographically sortable key. Moving a todo between two neighbours generates a
key that sorts strictly between theirs. The generator is pure and lives in
`domain/ordering.ts`.

## Consequences

A move is a **single-row update** regardless of list length, and two concurrent
moves in different parts of the list cannot corrupt each other, because neither
rewrites rows it did not touch.

The generator is pure, total and side-effect free, which makes it an ideal
red-green subject with property-based tests: for any `a < b`, the result sorts
strictly between them. It is also the deepest module in the codebase — two
arguments hiding the entire ordering strategy.

The costs are real but small: keys are not human-readable, and after many
insertions between the same two neighbours a key grows long enough to warrant a
rare rebalance. Rebalancing is deferred until the need is demonstrated, and is
noted as a known seam.

## Alternatives considered

**Integer position with reindex.** Readable values, trivially understood, but a
move rewrites O(n) rows and two simultaneous moves can interleave into a
corrupted order. Rejected on both counts.

**Integer position with gaps of 100.** Usually one write and readable values, but
the gap-exhaustion rebalance is a branch that is rarely exercised and easy to get
wrong — precisely the kind of code that passes review and fails in production.
