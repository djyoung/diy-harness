# 0007 — Move a todo

**Status:** Ready · **Phase:** 1 · **Date:** 2026-09-17

## Why

People prioritise by arranging. Dragging a todo to a new place must persist, feel
instant, and be possible without a mouse.

This is the most demanding slice in the application and the reference example in
[the workflow](../workflow.md).

## Scope

**In scope.** `POST /todos/:id/move`, the fractional key generator, and
drag-and-drop with keyboard support.

**Out of scope.** Moving multiple todos at once, nesting, cross-list moves, key
rebalancing — rebalancing is deferred until a long key is demonstrated.

## Acceptance criteria

### Key generation

**AC-1** — Given two keys `a` and `b` with `a < b`, when a key is generated
between them, then it sorts strictly after `a` and strictly before `b`.

**AC-2** — Given only a successor `b`, when a key is generated before it, then it
sorts before `b`. Given only a predecessor `a`, the generated key sorts after
`a`. Given neither, a valid initial key is produced.

**AC-3** — Given the same two neighbours, when keys are generated between them
repeatedly, then every generated key is distinct and correctly ordered, and key
length grows at most linearly in the number of insertions.

**AC-4** — Given any generated key, then it is a non-empty string containing only
characters from the defined alphabet, and it never has a trailing character that
would make ordering ambiguous.

### API

**AC-5** — Given todos ordered A, B, C, when a client sends
`POST /todos/:id/move` for C with `{ "beforeId": "A", "afterId": "B" }`, then the
response is `200` and the order becomes A, C, B.

**AC-6** — Given todos ordered A, B, C, when B is moved with `beforeId` absent,
then it becomes first. When moved with `afterId` absent, it becomes last.

**AC-7** — Given any move, when it succeeds, then exactly one row is updated and
its `modifiedAt` advances.

**AC-8** — Given a move where the todo id is unknown, or a named neighbour does
not exist, when it is sent, then the response is `404`.

**AC-9** — Given `beforeId` and `afterId` are not adjacent to each other in the
current order, when the move is sent, then the response is `409`. The client's
view of the list is stale and it must refetch.

**AC-10** — Given a move where the todo is its own neighbour, or `beforeId`
equals `afterId`, when it is sent, then the response is `422`.

**AC-11** — Given a move that would not change the order, when it is sent, then
the response is `200` and the list is unchanged.

### Interface

**AC-12** — Given the user drags a todo and drops it between two others, when the
drop occurs, then the list shows the new order immediately and a move request is
sent with the neighbouring ids.

**AC-13** — Given the request then fails, when the failure is received, then the
list reverts to the previous order and an error message is shown.

**AC-14** — Given a `409`, when it is received, then the client refetches the
list rather than reverting, because its view was stale.

**AC-15** — Given a todo has keyboard focus, when the user activates move mode
and presses the arrow keys, then the todo moves one place per press, and Enter
commits while Escape cancels.

**AC-16** — Given a move is in progress, then the current position is announced
to assistive technology.

**AC-17** — Given the page is reloaded after a successful move, then the new
order persists.

## Contract

`POST /todos/:id/move` — request `{ "beforeId": "uuid|null", "afterId":
"uuid|null" }`, at least one present → `200` with the moved todo.

The client sends **intent** — where the item was dropped — and the server derives
the key. The client never computes or sends a position key.

## Non-functional

Dragging stays at 60fps on a list of 200 todos. The move endpoint responds within
50ms at the 95th percentile. Keyboard reordering is a first-class path, not a
fallback, and is what the end-to-end test exercises.

## Open questions

None.
