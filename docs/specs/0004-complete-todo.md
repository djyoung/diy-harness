# 0004 — Complete and reactivate a todo

**Status:** Ready · **Phase:** 1 · **Date:** 2026-09-17

## Why

Marking something done is the point of a todo list. It must feel instant and it
must survive a reload.

## Scope

**In scope.** `PATCH /todos/:id` for `isComplete`, and the checkbox affordance
with optimistic update.

**Out of scope.** Archiving or hiding completed todos, completion timestamps,
filtering — filtering is in the backlog.

## Acceptance criteria

**AC-1** — Given an active todo, when a client sends
`PATCH /todos/:id` with `{ "isComplete": true }`, then the response is `200`, the
returned todo is complete, and `modifiedAt` has advanced.

**AC-2** — Given a complete todo, when the same request sets `isComplete` to
`false`, then it becomes active again. Completion is reversible.

**AC-3** — Given a todo is completed, when the list is fetched again, then its
position is unchanged. Completion does not reorder.

**AC-4** — Given an unknown id, when the request is sent, then the response is
`404`.

**AC-5** — Given a request whose `isComplete` is not a boolean, when it is sent,
then the response is `422`.

**AC-6** — Given a request containing no recognised fields, when it is sent,
then the response is `422`.

**AC-7** — Given the user activates the checkbox, when the request is in flight,
then the todo renders as complete immediately.

**AC-8** — Given the request then fails, when the failure is received, then the
todo reverts to its previous state and an error message is shown.

**AC-9** — Given a todo is rendered, then its completion control is a checkbox
with an accessible name derived from the todo's body, operable by keyboard.

## Contract

`PATCH /todos/:id` — request `{ "isComplete": true }` → `200` with the updated
todo. `PATCH` is partial by design; absent fields are left unchanged.

## Non-functional

The optimistic update renders within one frame of the interaction.

## Open questions

None.
