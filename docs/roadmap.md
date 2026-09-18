# Roadmap

Four phases. The app is finished early; the harness is the long project.

## Phase 0 — Walking skeleton

**Goal:** a green deployment on day one, not features.

Monorepo, Docker, devcontainer, Lefthook, CI, Railway deploy, and exactly one
trivial slice — `GET /todos` returning a list and rendering it. Everything after
this fills in a shape that already works end to end.

**Exit criteria**
- `bun verify` passes from a clean clone.
- A pull request runs every gate and deploys on merge.
- Branch protection is on and the default branch cannot be pushed to directly.

## Phase 1 — Core CRUD

**Goal:** build the rails, and find out where the documentation is ambiguous.

One slice per pull request, human-driven, following
[the workflow](./workflow.md): create, complete, edit, delete, reorder. You are
not testing autonomy yet — you are discovering which questions the specs fail to
answer, and fixing the specs.

**Exit criteria**
- All Phase 1 specs implemented, each by a single pull request.
- Coverage thresholds met; end-to-end journeys green.
- Every ambiguity found during the phase is resolved in `AGENTS.md` or a spec.

## Phase 2 — Harness instrumentation

**Goal:** the project turns on itself.

`AGENTS.md` matured from Phase 1 friction. Custom slash commands for the
repeated motions (`/spec`, `/slice`, `/review-fix`). Hooks. A CodeRabbit rubric
tuned to this codebase. `claude-code-action` wired for `@claude` tag mode so
work can be picked up from an issue. A spec template good enough that a
well-written issue is sufficient input.

**Exit criteria**
- An agent can run the entire loop locally without asking a question that the
  documentation should have answered.
- ≥90% of human-authored pull requests pass CI on the first attempt.
- Every domain rule is written in a spec, not only in code.

## Phase 3 — Supervised autonomy

**Goal:** close the feedback loop.

You file an issue with a spec; the agent opens a pull request; you review every
one. The discipline that makes this phase work: **every human correction is a
harness defect.** It is fixed in `AGENTS.md`, a spec template or a lint rule —
never only in the branch. See [feedback-loop.md](./feedback-loop.md).

**Exit criteria**
- Ten consecutive agent pull requests merged with no human code edits.
- Findings per pull request trending down across that run.
- No incident caused by an agent-authored change reaching production.

## Phase 4 — Measured autonomy

**Goal:** expand scope only as far as the numbers justify.

Instrument the loop and let the metrics set the pace. Candidate scope
expansions, in order of risk: dependency updates, bug fixes from issues, small
features from specs, spec authoring itself.

## Metrics

| Metric | Question it answers |
|---|---|
| First-pass CI green rate | Is the feedforward good enough? |
| Human edit rate — merged with zero human code changes | Is the output actually usable? |
| Review findings per pull request, over time | Is the feedback loop learning? |
| Rework rate — reverts or fix-ups within 48 hours | Are we mistaking green for correct? |
| Escalation rate and precision | Does it stop when it should? |

The last one matters most and is the easiest to neglect. An agent that never
asks a question is not autonomous — it is unsupervised, and the difference only
becomes visible after it has been wrong for a while.

## Backlog

Not scheduled; good candidates for agent work once Phase 3 holds.

- Filtering: all / active / completed
- Undo on delete, via optimistic rollback and a toast
- Authentication and per-user lists
- Migration from Railway to Fly.io + Neon, with a database branch per pull
  request
- Observability: pino, request ids, OpenTelemetry, Sentry
- Optimistic concurrency with a version column
