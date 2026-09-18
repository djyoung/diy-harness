# 0009 — Railway now, Fly.io and Neon later

**Status:** Accepted · **Date:** 2026-09-17

## Context

The project needs continuous deployment and per-pull-request preview
environments, at low cost. Neither Railway nor Fly.io has a free tier any longer;
both land around five dollars a month at this size. Pricing in this area changes
often and should be re-verified before committing spend.

## Decision

Deploy to Railway now. Migrate to Fly.io plus Neon Postgres later, as a
deliberate roadmap item.

## Consequences

Railway gives pull request environments as a first-class feature — the whole
stack, including Postgres, cloned per pull request with no workflow to write. The
deployment pipeline is therefore green early, and the time saved goes into the
harness, which is the actual subject of the project.

Railway's preview databases start empty, so previews are seeded from migrations
plus faker factories. That seeding path is useful in its own right and is
exercised on every pull request.

The same Dockerfile runs locally and in production, so the later migration is
small. That migration is itself a well-scoped task and a good candidate for
agent work once Phase 3 holds.

## Alternatives considered

**Fly.io plus Neon now.** Cheaper at rest, since machines stop to zero, and
better previews: Neon's free tier gives a copy-on-write database branch per pull
request, so a preview has the real schema and seeded data in about a second. The
cost is a GitHub Actions workflow to write and own. Deferred rather than
rejected — it is the eventual target.

**Render.** Free tier spins down after inactivity and free Postgres expires;
preview environments require a paid plan.

**Vercel plus Neon.** Best frontend preview experience, but splits the stack
across platforms and breaks the single-Dockerfile parity story.
