# 0001 — Bun workspaces monorepo with Turborepo

**Status:** Accepted · **Date:** 2026-09-17

## Context

The frontend, backend and their shared contract change together. The unit of
work in this project is a vertical slice, and the unit of review is a pull
request that contains one.

## Decision

A single repository using Bun workspaces: `apps/api`, `apps/web`,
`packages/contracts`, `packages/config`. Turborepo orchestrates tasks and caches
results.

## Consequences

One pull request can carry a complete slice — migration, endpoint, contract,
interface, tests — which is what makes vertical-slice review possible at all.
Shared types are a workspace import rather than a published package, so there is
no version skew between client and server.

Turborepo's task graph keeps CI fast as gates accumulate, and its affected-project
filtering is what allows the pre-commit hook to stay under five seconds.

The cost is a build orchestrator to understand, and the discipline that a
monorepo does not by itself prevent inappropriate coupling: the layering rules in
`ARCHITECTURE.md` still have to be enforced in review.

## Alternatives considered

**Two repositories.** More realistic to some organisations, but a slice becomes
two coordinated pull requests plus a published contract package. Real friction
for an autonomy experiment, where the number of steps between intent and merge is
the thing being minimised.

**Monorepo without Turborepo.** Simpler and less magical, but every CI run
re-does all work. Rejected because CI duration directly throttles the agent
feedback loop.
