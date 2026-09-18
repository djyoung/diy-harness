# 0006 — Delete a todo

**Status:** Ready · **Phase:** 1 · **Date:** 2026-09-17

## Why

Lists accumulate things that are no longer wanted. Deletion is permanent — see
[ADR 0008](../adr/0008-hard-delete.md).

## Scope

**In scope.** `DELETE /todos/:id`, hard deletion, and a confirmation step in the
interface.

**Out of scope.** Undo, trash, restore, bulk deletion. Undo is in the backlog.

## Acceptance criteria

**AC-1** — Given an existing todo, when a client sends `DELETE /todos/:id`, then
the response is `204` with no body, and the row is removed.

**AC-2** — Given a todo was deleted, when `GET /todos/:id` is requested, then the
response is `404`.

**AC-3** — Given an unknown id, when `DELETE` is sent, then the response is
`404`. Deletion is not treated as idempotently successful, so that a client can
distinguish "I deleted it" from "it was never there".

**AC-4** — Given a todo in the middle of the list is deleted, when the list is
fetched, then the remaining todos keep their relative order and their position
keys are unchanged. Deletion rewrites no other rows.

**AC-5** — Given the user activates delete, when they are asked to confirm, then
nothing is sent until they confirm; on cancel, nothing happens.

**AC-6** — Given the user confirms, when the request is in flight, then the todo
is removed from the list immediately.

**AC-7** — Given the request then fails, when the failure is received, then the
todo reappears in its original position and an error message is shown.

**AC-8** — Given the delete control is rendered, then it has an accessible name
identifying which todo it deletes, and the confirmation is keyboard operable and
focus-trapped.

## Contract

`DELETE /todos/:id` → `204`, or `404`. No response body in either the success
case or where the error contract in [spec 0002](./0002-api-error-responses.md)
applies to the failure.

## Non-functional

Deletion is irreversible; the confirmation copy says so plainly.

## Open questions

None.
