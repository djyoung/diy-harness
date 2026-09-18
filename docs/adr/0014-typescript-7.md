# 0014 — TypeScript 7

**Status:** Accepted · **Date:** 2026-09-17

## Context

Typechecking is the first red in every slice ([workflow](../workflow.md)), so its
speed sets the pace of the tightest feedback loop an agent has. The project
starts from an empty repository, with no existing code tied to an older
compiler.

## Decision

TypeScript 7, the native compiler, pinned to an exact version at the workspace
root. Every package extends `packages/config/tsconfig.base.json`, which enables
`strict` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and the
other checks that catch mistakes an agent is otherwise likely to ship. Packages
typecheck with `tsc --noEmit`; bundling and running are left to Bun and Vite.

## Consequences

Typechecking is several times faster than with the JavaScript compiler, which
matters most in pre-commit and in the red step of every slice.

The risk is tooling that depends on the compiler's programmatic API rather than
the `tsc` binary. If a dependency added later needs that API and does not
support TypeScript 7, the fix is to install the 6.x compiler alongside for that
tool only, recorded in a superseding ADR — not to lower the project's compiler.

## Alternatives considered

**TypeScript 6.** The last JavaScript-based compiler and the most compatible with
older tooling, but slower on exactly the loop this project is trying to shorten.
