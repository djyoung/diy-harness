# 0005 — Edit a todo's body

**Status:** Ready · **Phase:** 1 · **Date:** 2026-09-17

## Why

People mistype, and a todo whose text cannot be fixed has to be deleted and
recreated, losing its place in the list.

## Scope

**In scope.** `PUT /todos/:id` as a full replacement, `PATCH /todos/:id` for the
body alone, and inline editing in the interface.

**Out of scope.** Rich text, edit history, concurrent edit resolution.

## Acceptance criteria

**AC-1** — Given an existing todo, when a client sends `PUT /todos/:id` with a
complete representation, then the response is `200` and the todo reflects it.

**AC-2** — Given a `PUT` request omitting a required field, when it is sent, then
the response is `422`. `PUT` is a full replacement, not a merge.

**AC-3** — Given a `PATCH` request carrying only `body`, when it is sent, then
only the body changes.

**AC-4** — Given a body that is empty, whitespace only, or over 1000 characters,
when either request is sent, then the response is `422` and nothing is written.

**AC-5** — Given a successful update, then `modifiedAt` advances, `createdAt` is
unchanged, and `position` is unchanged.

**AC-6** — Given an unknown id, when either request is sent, then the response is
`404`.

**AC-7** — Given a todo in the list, when the user activates its body, then it
becomes an editable input containing the current text, focused, with the caret at
the end.

**AC-8** — Given the user is editing, when they press Enter or blur the field,
then the change is saved optimistically; when they press Escape, then the edit is
abandoned and the original text is restored without a request.

**AC-9** — Given a save fails, when the failure is received, then the previous
text is restored and an error message is shown.

## Contract

`PUT /todos/:id` — the full todo representation, server-owned fields ignored.
`PATCH /todos/:id` — any subset of `body` and `isComplete`.

## Non-functional

Editing is fully keyboard operable, and the input is labelled.

## Open questions

None.
