# 0013 — Biome for linting and formatting

**Status:** Accepted · **Date:** 2026-09-17

## Context

Every change needs a lint and format gate that runs at pre-commit, in CI and on
demand, and that an agent can fix automatically. The pre-commit hook has a
five-second budget ([ADR 0001](./0001-monorepo.md)), so the tool has to be fast
on the whole repository, not just on changed files.

## Decision

Biome is the only linter and formatter. The shared configuration lives in
`packages/config/biome.json`; the root `biome.json` extends it and adds only
repository-level settings (VCS integration, file includes). `bun lint` checks,
`bun format` applies safe fixes.

## Consequences

One tool, one configuration file and one binary replace ESLint, Prettier and the
plugin set that binds them, so there is no disagreement between linter and
formatter for an agent to oscillate between. It checks this repository in
milliseconds, which keeps the pre-commit budget realistic as the codebase grows.

The cost is a smaller rule set than ESLint's ecosystem — notably no type-aware
rules equivalent to `typescript-eslint`'s strictest presets. `tsc` in strict mode
carries that weight instead. Markdown is excluded from formatting, because the
documentation is hand-wrapped prose.

## Alternatives considered

**ESLint with Prettier.** The largest rule ecosystem and type-aware linting, but
two tools, several plugins, a slower run, and configuration that is itself a
maintenance burden. Rejected on speed and on the number of moving parts an agent
has to understand.
