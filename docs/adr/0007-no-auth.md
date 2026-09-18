# 0007 — No authentication in v1

**Status:** Accepted · **Date:** 2026-09-17

## Context

The data model is `id, body, position, isComplete, createdAt, modifiedAt` — no
owner. The purpose of the project is to study the harness, not to build a
product.

## Decision

No authentication. A single shared todo list. Authentication is documented as a
known seam and sits in the backlog.

## Consequences

Every slice stays thin, so the harness remains the subject of attention rather
than auth plumbing. End-to-end tests need no login step, which keeps them fast
and legible.

The repository layer is written so that adding a scope later is additive: reads
compose from a single base query, so a `userId` column, a middleware and a scope
parameter are sufficient. That seam is recorded in `ARCHITECTURE.md` so it is a
deliberate design position rather than an accident.

The application must not be deployed with real user data, and the public
deployment is understood to be a demonstration.

## Alternatives considered

**Authentication from day one.** More realistic, but roughly doubles the surface
area before the first todo renders, and adds authentication state to every
end-to-end test. Rejected as a poor trade against the project's actual goal.
