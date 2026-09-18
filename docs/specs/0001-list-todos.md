# 0001 — List todos

**Status:** Ready · **Phase:** 0 · **Date:** 2026-09-17

## Why

A user opens the application and sees their todo list in the order they arranged
it. This is also the walking skeleton: the first slice proves the whole pipeline
works end to end, from migration through to rendered markup and a deployment.

## Scope

**In scope.** The `todos` table and its initial migration. `GET /todos`. A page
that renders the list, including empty and error states.

**Out of scope.** Creating, editing, completing, deleting, reordering,
pagination, filtering.

## Acceptance criteria

**AC-1** — Given three todos exist with position keys ordering them B, A, C,
when a client requests `GET /todos`, then the response is `200` and the array is
ordered B, A, C.

**AC-2** — Given no todos exist, when a client requests `GET /todos`, then the
response is `200` with an empty array — not `404`.

**AC-3** — Given a todo exists, when it is serialised, then it carries exactly
`id`, `body`, `position`, `isComplete`, `createdAt` and `modifiedAt`, with
timestamps as ISO 8601 strings in UTC.

**AC-4** — Given the API returns todos, when the page loads, then each todo's
body is visible, and completed todos are distinguishable from active ones.

**AC-5** — Given no todos exist, when the page loads, then an empty state
explains that the list is empty.

**AC-6** — Given the API is unreachable, when the page loads, then an error
message is shown with a retry control, and the page does not render a
permanently blank list.

**AC-7** — Given the request is in flight, when the page first loads, then a
loading state is shown.

## Contract

`GET /todos` → `200`

```json
[
  {
    "id": "018f...",
    "body": "Buy milk",
    "position": "a1",
    "isComplete": false,
    "createdAt": "2026-09-17T10:00:00.000Z",
    "modifiedAt": "2026-09-17T10:00:00.000Z"
  }
]
```

Ordering is `ORDER BY position ASC`, applied by the database, never by the
client.

## Non-functional

The list renders within 200ms of the response on a list of 100 todos. The list
is a `ul` of `li` elements so that it is navigable by assistive technology.

## Open questions

None.
