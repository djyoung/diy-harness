# Ubiquitous language

The vocabulary of this project. These words mean exactly this in conversation,
in code, in specs, in tests and in commit messages. Where a term appears in
code, the spelling given here is the spelling used.

## Domain

**Todo** — a single item on the list. The only entity in the domain. Never "task",
"item" or "entry" in code or prose.

**Body** — the text content of a todo. Not "title", "text", "description" or
"name". One to one thousand characters, non-empty after trimming.

**Complete / Active** — the two states of a todo, held in `isComplete`. A todo is
*completed* (verb) by a user and is thereafter *complete* (adjective). A todo
that is not complete is *active*. Never "done", "finished" or "checked".

**Position key** — the opaque, lexicographically sortable string in `position`
that determines a todo's place in the list. It is a key, not an index: it has no
numeric meaning and its value is never shown to a user or interpreted by a
client.

**Move** — to change a todo's place in the list, expressed as intent: place this
todo between these two neighbours. Reserved for the operation; "reorder"
describes the user-facing capability in prose, but the endpoint, the hook and the
service are all *move*.

**Neighbour** — the todo immediately before or after a position in the list.
`beforeId` and `afterId` in a move request identify neighbours; a missing
neighbour means the start or end of the list.

**List** — the single, ordered, shared collection of all todos. There is exactly
one, and it is never referred to as a "board", "project" or "collection".

## Process

**Slice** — a change that goes through every layer, from schema to interface,
implementing one spec. The unit of work and the unit of a pull request.

**Spec** — a numbered, immutable document in `docs/specs/` stating acceptance
criteria as Given / When / Then. Superseded, never edited.

**Gate** — an automated check that can block progress: a hook, a CI job, a
coverage threshold, a required review.

**Harness** — the whole system around the application: specs, conventions,
generators, tests, gates, review and deployment. The actual subject of this
project.

**Feedforward** — what an agent is given before it starts: specs, `AGENTS.md`,
types, generated clients. Reduces the need to ask.

**Feedback** — what an agent receives after acting: test failures, review
findings, metrics. Reduces the need to be told twice.

**Escalation** — an agent stopping to ask rather than guessing. A success
condition, measured, not an admission of failure.
