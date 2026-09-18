# 0005 — Contract-first code generation

**Status:** Accepted · **Date:** 2026-09-17

## Context

The most common failure in a split frontend and backend is drift: the client
believes in a response shape the server no longer sends. Reviews catch this
inconsistently, and mocked tests actively hide it, because a hand-written mock
encodes the shape the author *believed* in.

## Decision

Zod schemas in `packages/contracts` are the single source of truth. `bun gen`
derives, in order: the OpenAPI document from the route schemas, the typed client
for the frontend, and the MSW handlers used by component tests. Generated output
is committed, and CI fails if regeneration produces a diff.

## Consequences

Drift stops being a bug class and becomes an unrepresentable state: a breaking
schema change fails the typecheck in the client before it can reach review.

Test mocks cannot lie. Because handlers come from the same document as the
client, a component test that passes is evidence about the real contract rather
than about the author's memory of it.

This is the highest-leverage automation in the repository and correspondingly
the most important not to bypass. Hand-editing generated files, or skipping
`bun gen`, invalidates the entire argument — hence the CI check rather than a
convention.

The cost is a generation step to remember, mitigated by running it in pre-push
and failing on any diff.
