# Contributing

Read [`AGENTS.md`](./AGENTS.md) first — it applies to humans too. This file
covers only the mechanics.

## Getting set up

Development happens inside the devcontainer, and only there
([ADR 0016](./docs/adr/0016-devcontainer-only-development.md)). On the host you
need Docker and either VS Code with the Dev Containers extension or the
`devcontainer` command line interface. The container gives you Bun, Node,
Docker-in-Docker and Postgres, pinned. Developing directly on the host is not
supported.

[Local development](./docs/local-development.md) has the exact commands for
both ways in. In short, from the command line:

```bash
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . bun dev
```

`bun verify` runs the full local gate — the same checks CI runs, minus
deployment. Run it before opening a pull request.

## Branches and commits

Branch from `main`, named `type/short-description` — `feat/move-todo`,
`fix/empty-body-validation`, `chore/bump-drizzle`.

Commits follow Conventional Commits and are enforced by commitlint:

```
feat(api): add move endpoint
fix(web): restore list order when move fails
docs(adr): record hosting decision
```

Scopes are `api`, `web`, `contracts`, `e2e`, `ci`, `docs`, `adr`.

## Opening a pull request

Fill in every section of the template. The parts people are tempted to skip are
the ones that matter most:

- **Acceptance criteria**, each linked to the test that proves it. A reviewer
  should not have to search for the evidence.
- **Before and after screenshots** for any visible change, a video for
  interaction changes. Playwright captures these during the end-to-end run.
- **Harness feedback** — what this slice revealed about the scaffolding. Writing
  "nothing" is allowed when it is true and is a finding in itself when it is not.

Keep the diff under roughly 400 lines. If it is bigger, it was more than one
slice.

## Review

One human approval, plus CodeRabbit. Every CodeRabbit finding is either fixed or
answered — silently ignoring one leaves the next reader unable to tell whether it
was considered.

If review teaches you something that a document should have said, change the
document in the same pull request. That is the whole discipline, and it is
described in [docs/feedback-loop.md](./docs/feedback-loop.md).

## Merging

Squash merge only, so `main` is one commit per slice and each is independently
revertible. Merging deploys. If a deploy fails its smoke test it rolls back
automatically — investigate before re-merging rather than retrying.

## Changing the rules

Conventions, gates and architecture change by pull request like anything else,
with the reasoning written down. Tightening a gate is ordinary work. Loosening
one needs an ADR explaining why the original reasoning no longer holds, and never
rides along inside a feature branch.
