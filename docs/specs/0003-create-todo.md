# 0003 — Create a todo

**Status:** Ready · **Phase:** 1 · **Date:** 2026-09-17

## Why

A user adds something they need to do. New todos go to the end of the list,
which is where a person expects an addition to land.

## Scope

**In scope.** `POST /todos`, position key generation for an append, and the
composer control on the page.

**Out of scope.** Inserting at an arbitrary position, bulk creation, templates.

## Acceptance criteria

**AC-1** — Given a valid body, when a client sends `POST /todos`, then the
response is `201`, the `Location` header is `/todos/{id}`, and the body is the
created todo.

**AC-2** — Given todos already exist, when one is created, then its position key
sorts after every existing key, so it appears last.

**AC-3** — Given no todos exist, when one is created, then it receives a valid
initial position key and is the only item.

**AC-4** — Given a body that is empty or whitespace only, when a client sends
`POST /todos`, then the response is `422` and no row is written.

**AC-5** — Given a body longer than 1000 characters, when a client sends
`POST /todos`, then the response is `422`.

**AC-6** — Given a body with leading or trailing whitespace, when the todo is
created, then the stored body is trimmed.

**AC-7** — Given a todo is created, then `isComplete` is `false`, and
`createdAt` and `modifiedAt` are equal.

**AC-8** — Given a client supplies `id`, `position`, `createdAt` or `modifiedAt`
in the request, when it is handled, then those values are ignored. The server
owns them.

**AC-9** — Given the user types a body and submits, when the request is in
flight, then the todo appears immediately at the end of the list, and the input
clears.

**AC-10** — Given the request then fails, when the failure is received, then the
optimistic todo is removed, an error message is shown, and the text the user
typed is restored to the input so it is not lost.

## Contract

`POST /todos` — request `{ "body": "Buy milk" }` → `201` with the created todo.
Errors per [spec 0002](./0002-api-error-responses.md).

## Non-functional

The composer is reachable and submittable by keyboard alone; Enter submits. The
input is labelled for assistive technology.

## Open questions

None.
