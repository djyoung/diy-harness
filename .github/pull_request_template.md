## Spec

Implements `docs/specs/NNNN-....md`.

<!-- If there is no spec, this is a refactor, tooling or docs change. Say which. -->

## What and why

<!-- One paragraph. What changed, and why this approach. -->

## Acceptance criteria

<!-- Copy each AC from the spec and link the test that proves it. -->

- [ ] AC-1 — `path/to/test.ts`
- [ ] AC-2 — `path/to/test.ts`

## Evidence

<!-- Required for any visible change. Video for interaction changes. -->

| Before | After |
|---|---|
|  |  |

Verified manually on the pull request environment: <!-- yes / no, and how -->

## Checklist

- [ ] Tests written before the code they exercise
- [ ] Every error path in the spec is tested
- [ ] `bun verify` passes locally
- [ ] `bun gen` produces no diff
- [ ] Migration applies to an empty **and** a production-like database
- [ ] Migration is backward compatible with deployed code, or the risk is noted
- [ ] No layering violation (see `ARCHITECTURE.md`)
- [ ] No new dependency, or an ADR is included
- [ ] No spec was edited (supersede instead)
- [ ] No gate weakened, no test skipped
- [ ] Diff under ~400 lines, or explained below

## Harness feedback

<!-- What did this slice reveal about the harness? What should change in
     AGENTS.md, a spec template, a lint rule or the review rubric so the next
     one goes better? Write "nothing" only if that is true. -->

## Notes for the reviewer

<!-- Anything non-obvious, or where you want a second opinion. -->
