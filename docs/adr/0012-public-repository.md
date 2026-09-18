# 0012 — Public repository

**Status:** Accepted · **Date:** 2026-09-17

## Context

The repository can be public or private. The choice affects tooling cost and how
freely the project can be shared.

## Decision

The repository is public.

## Consequences

CodeRabbit Pro is free for public repositories, and GitHub Actions minutes are
unmetered, so the gates in `docs/ci-cd.md` can be as thorough as they need to be
without a budget conversation.

The application holds no secrets and no personal data — there is no
authentication and no real user content by design, per
[ADR 0007](./0007-no-auth.md) — so a public repository carries no disclosure
risk here.

Being public also makes the project shareable as a reference on harness
engineering, which is its purpose.

The obligations that follow: secrets never enter the repository,
`.env.example` documents variables without values, and `gitleaks` runs at
pre-commit and in CI. A public repository makes an accidental commit
irreversible in practice, since it must be assumed scraped the moment it lands.
