# Definition of done

A slice is done when every line below is true. Not "mostly" — the value of the
list is that it is binary, so that an agent can self-assess against it and a
reviewer can check it in under a minute.

## Specification
- [ ] A numbered spec in `docs/specs/` covers the change, and is referenced by
      number in the pull request.
- [ ] Every acceptance criterion in that spec has a corresponding test.
- [ ] No spec file was edited. If requirements changed, a new spec supersedes
      the old one.

## Implementation
- [ ] The change is complete through every layer: contract, domain,
      persistence, transport, interface.
- [ ] No layering violation: domain imports nothing with I/O, tables are touched
      only inside a repository, components hold no server state.
- [ ] Input is validated once at the boundary, using the shared Zod schema.
- [ ] Generated files are current — `bun gen` produces no diff.
- [ ] No new dependency without an accepted ADR.

## Tests
- [ ] Tests were written before the code they exercise.
- [ ] Unit tests cover the domain logic, including boundaries.
- [ ] Integration tests cover the endpoint against real Postgres, including
      every error status the spec names.
- [ ] Component tests cover the interface, including the optimistic rollback
      path where one exists.
- [ ] An end-to-end test covers the journey, if the slice introduces one.
- [ ] Coverage thresholds met. No test skipped, `.only`'d or retried.

## Migration
- [ ] Migration applies cleanly to an empty database and to a production-like
      copy.
- [ ] Migration is backward compatible with the currently deployed code, or the
      incompatibility is called out explicitly in the pull request.

## Evidence
- [ ] Before and after screenshots for any visible change.
- [ ] A short video for interaction changes such as drag and drop.
- [ ] Manual verification against the pull request environment, noted in the
      description.

## Review
- [ ] `bun verify` passes locally.
- [ ] All CI checks green on the first push, or the reason they were not is
      understood.
- [ ] Every CodeRabbit finding is fixed or answered.
- [ ] One human approval.
- [ ] Diff under roughly 400 lines, or the reason is explained.

## Afterwards
- [ ] Anything a reviewer had to explain has been written back into `AGENTS.md`,
      a spec template, or a lint rule — not only into the branch.
