# CI/CD and quality gates

The principle: **fast feedback early, thorough feedback before merge.** A gate
that is slow in the wrong place does not add confidence, it just teaches people
to bypass it.

## Local gates — Lefthook

Lefthook over Husky: a single binary, parallel execution, no `node_modules`
indirection in the hook path.

### Pre-commit — budget under 5 seconds

Staged files only.

- Biome format and lint with autofix
- Typecheck on affected projects only, via Turborepo
- Secret scan (gitleaks)

### Commit message

- Conventional Commits, enforced by commitlint. The changelog and the release
  process both derive from this.

### Pre-push — budget under 60 seconds

- Unit and component tests
- Integration tests for affected projects
- `bun gen` and fail if it produces a diff — stale generated files never reach
  a pull request

End-to-end tests are deliberately **not** in pre-push. A slow push discourages
small commits, and an agent iterating quickly would be throttled by it for
little gain.

## Continuous integration — GitHub Actions

Runs on every pull request. Jobs are parallel; all are required checks.

| Job | Contents |
|---|---|
| `lint` | Biome, formatting check, `bun gen` diff check |
| `typecheck` | Full monorepo, no project references skipped |
| `test-unit` | Unit and component tests, coverage thresholds |
| `test-integration` | Testcontainers Postgres, migrations applied |
| `test-e2e` | Playwright against docker compose; uploads traces and screenshots |
| `build` | Both apps, plus Docker images |
| `migrate-check` | Migrations apply cleanly to an empty database *and* to a copy of the current production schema |

Turborepo caching keeps the typical run under five minutes as the suite grows.

`migrate-check` earns its place: a migration that works on an empty database and
fails on real data is the most common way a green pipeline still breaks
production.

## Review gates

- **CodeRabbit** reviews every pull request against a repository rubric in
  `.coderabbit.yaml`. The rubric is part of the harness and is tuned as findings
  recur — see [feedback-loop.md](./feedback-loop.md).
- **One human approval** required. During Phase 3 this is never waived for
  agent-authored work.

## Branch protection on `main`

- No direct pushes, including for administrators.
- All required checks green.
- One approving review; stale approvals dismissed on new commits.
- Branch must be up to date before merging.
- Conversations resolved.
- Squash merge only, so `main` is one commit per slice and each is revertible.
- Linear history.

## Deployment

Merge to `main` deploys to Railway. The pipeline runs migrations first, then
releases; a failed migration aborts the deploy before any new code serves
traffic. A post-deploy smoke test hits the health endpoint and one read path,
and rolls back on failure.

Pull requests get a Railway pull request environment: the full stack with its own
Postgres, seeded from migrations plus faker factories, torn down on close.

Planned migration to Fly.io plus Neon, where a preview gets a copy-on-write
database branch rather than an empty one. Tracked in [roadmap.md](./roadmap.md).

## Secrets

Never in the repository. Railway environment variables for runtime, GitHub
Actions secrets for CI. `.env.example` is committed and documents every variable
with a safe default or a description. `gitleaks` runs at pre-commit and in CI.
