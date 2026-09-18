# Specs

One numbered file per slice. A spec states what must be true when the slice is
done, as Given / When / Then acceptance criteria, and nothing about how.

**Specs are immutable.** Once written, a spec is never edited — not for a typo,
not for a clarification. If a requirement changes, write the next number and mark
the old one superseded here. See [ADR 0011](../adr/0011-immutable-specs.md).

| # | Slice | Phase | Status |
|---|---|---|---|
| [0001](./0001-list-todos.md) | List todos | 0 | Ready |
| [0002](./0002-api-error-responses.md) | API error responses | 0 | Ready |
| [0003](./0003-create-todo.md) | Create a todo | 1 | Ready |
| [0004](./0004-complete-todo.md) | Complete and reactivate a todo | 1 | Ready |
| [0005](./0005-edit-todo-body.md) | Edit a todo's body | 1 | Ready |
| [0006](./0006-delete-todo.md) | Delete a todo | 1 | Ready |
| [0007](./0007-move-todo.md) | Move a todo | 1 | Ready |

Statuses: **Draft** (being written) · **Ready** (approved, implementable) ·
**Done** (merged, with the pull request linked) · **Superseded by NNNN**.

## Template

```markdown
# NNNN — Title

**Status:** Draft · **Phase:** N · **Date:** YYYY-MM-DD

## Why
One paragraph: the user-visible reason this exists.

## Scope
In scope / Out of scope, as two short lists.

## Acceptance criteria
AC-1 — Given ... When ... Then ...

## Contract
Request and response shapes, status codes.

## Non-functional
Performance, accessibility, observability where relevant.

## Open questions
Anything unresolved. A spec with open questions is not Ready.
```
