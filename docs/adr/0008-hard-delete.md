# 0008 — Hard delete, no soft delete

**Status:** Accepted · **Date:** 2026-09-17

## Context

`DELETE /todos/:id` could remove the row or mark it deleted. Soft deletion was
considered, including whether it should be expressed as a `deletedAt` timestamp
or an `isDeleted` flag.

## Decision

Hard delete. The row is removed. No undo in v1.

## Consequences

Every read stays simple, with no filter that can be forgotten — a forgotten
soft-delete filter is a data leak, and it only takes one query outside the
repository to cause it.

Deletion is irreversible, guarded by a confirmation in the interface. Undo is in
the backlog and would be built as an optimistic rollback with a brief toast,
which delivers the user-visible benefit without a schema-wide tax.

## If soft delete is ever adopted

Use a nullable `deleted_at` timestamp, not a boolean. The timestamp strictly
dominates: the boolean is derivable from it, the reverse is not; a single
nullable column cannot contradict itself the way a flag and a date can; retention
becomes one line of SQL; and a partial index on `deleted_at IS NULL` keeps the
hot path small. The filter would live in the repository base query, enforced by
the rule that tables are never touched elsewhere.

## Alternatives considered

**Soft delete in v1.** Without a trash view and a restore endpoint the rows are
simply unreachable, which is cost without benefit. It would also add roughly one
extra slice of work for no user-visible change.
