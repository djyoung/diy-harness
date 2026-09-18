# 0010 — CodeRabbit now, Claude Code Action in Phase 2

**Status:** Accepted · **Date:** 2026-09-17

## Context

The project needs AI code review on pull requests, and eventually needs a way for
an agent to pick up work without a human at a terminal. These are different
problems that are easily conflated.

## Decision

CodeRabbit reviews every pull request from Phase 0. `claude-code-action` is added
in Phase 2, for execution rather than as a second reviewer.

## Consequences

**CodeRabbit observes; the Claude action acts.** CodeRabbit leaves findings that
someone must action. The Claude action checks out a branch, writes code, runs
tests and opens a pull request in response to an issue or a comment. Using it
merely as a second reviewer would underuse it.

CodeRabbit Pro is free for public repositories, which is one reason this
repository is public — see [ADR 0012](./0012-public-repository.md). Its rubric lives in `.coderabbit.yaml` and is part of the harness:
recurring findings are fixed at the rubric level, not one pull request at a time.

Deferring the Claude action to Phase 2 is deliberate. It is only useful once
`AGENTS.md` and the specs are mature enough that an agent can work unsupervised;
introduced earlier, its failures would be caused by missing feedforward rather
than by anything it could fix.

The loop between the two is the interesting part: findings on agent-authored pull
requests are the signal folded back into `AGENTS.md`, so the next pull request
does not repeat the mistake. See [feedback-loop.md](../feedback-loop.md).

## Alternatives considered

**CodeRabbit plus Claude action from day one.** More signal earlier, at the cost
of debugging two systems while the conventions are still unstable.

**CodeRabbit only, permanently.** Simplest, but the autonomy goal stays manual
indefinitely, which defeats the purpose of the project.
