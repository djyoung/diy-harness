# 0006 — Vitest, Testcontainers and Playwright

**Status:** Accepted · **Date:** 2026-09-17

## Context

The project follows the testing pyramid with unit, integration and end-to-end
coverage, and uses red-green TDD for every slice. Feedback speed at the bottom of
the pyramid directly determines how usable the loop is.

## Decision

Vitest for unit and component tests, React Testing Library with generated MSW
handlers for components, Testcontainers-backed Postgres for integration tests,
Playwright for end-to-end journeys. Faker behind typed factories in
`packages/contracts`.

## Consequences

Integration tests run against real Postgres with real migrations, so a wrong
query, a missing constraint or a broken migration fails a test rather than a
deploy. The cost is container startup, mitigated by one container per suite and
per-test transaction rollback.

Component tests using generated handlers inherit the guarantee from
[ADR 0005](./0005-contract-first-codegen.md): mocks cannot drift from the
contract.

Factories keep fixtures schema-valid by construction and let a test state only
what matters to it, which makes the salient value visible instead of buried among
irrelevant fields.

Playwright's trace and screenshot capture doubles as pull request evidence, so the
screenshot requirement costs nothing extra once wired up.

## Alternatives considered

**Bun's built-in test runner.** Very fast and one fewer dependency, but weaker
React Testing Library support and fewer watch and coverage facilities than Vitest.
Worth revisiting as it matures.

**A long-lived docker-compose Postgres for integration tests.** Simpler locally
and faster to start, but weaker isolation and more CI wiring. Testcontainers was
preferred because the harness should make a clean run reproducible from nothing.
