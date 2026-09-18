# 0002 — Hono, Zod and Drizzle

**Status:** Accepted · **Date:** 2026-09-17

## Context

A TypeScript backend on Bun, with validation at the boundary and persistence to
Postgres. The user was unfamiliar with the Node and Bun ecosystem and asked for
a recommendation, including whether to use DTO classes or schema validation.

## Decision

Hono for HTTP, Zod for validation via `@hono/zod-openapi`, Drizzle for
persistence.

## Consequences

**Zod schemas are the DTOs.** Parse at the boundary, infer types inward with
`z.infer`, and there is exactly one definition of a shape rather than a class, a
validator and an interface that must be kept in agreement. This is the decision
that makes [ADR 0005](./0005-contract-first-codegen.md) possible.

**Hono** is small, fast, Bun-native and has strong type inference, with
`@hono/zod-openapi` producing an OpenAPI document directly from the route
schemas — the input to all downstream generation.

**Drizzle** produces SQL-shaped, type-safe queries and plain-SQL migration files.
Migrations that are readable SQL can be reviewed in a pull request, which matters
when an agent writes them; a generated binary migration cannot be meaningfully
reviewed.

The cost is a smaller ecosystem than Express, and relation queries that are more
verbose than Prisma's.

## Alternatives considered

**NestJS with class-validator and TypeORM.** Familiar in enterprises and strong
on dependency injection, but decorator-heavy ceremony for a six-field entity, and
it reintroduces the DTO-class duplication we specifically wanted to avoid.

**Prisma.** Better relation ergonomics and a pleasant schema DSL, but a heavier
runtime and generated migrations that are harder to review.

**Elysia.** Faster still and excellent end-to-end inference through Eden, but
Bun-only and a smaller ecosystem. Worth revisiting if Hono's inference proves
limiting.
