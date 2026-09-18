# Local development

The goal is that a clean clone reaches a green `bun verify` with one command, and
that what runs locally is what runs in production. Every deviation from that is a
place where the harness will eventually lie to an agent about whether its work is
correct.

## Devcontainer

The supported environment. `.devcontainer/devcontainer.json` pins Bun, Node,
Docker-in-Docker, Postgres, Playwright browsers and the editor extensions for
Biome and Tailwind, so that toolchain drift between contributors — human or
otherwise — cannot cause a failure that only reproduces on one machine.

`postCreateCommand` installs dependencies, applies migrations and seeds
development data, so the container comes up usable rather than merely running.

## Docker

Three compositions, sharing one set of images:

- `docker-compose.yml` — Postgres plus both applications in development mode with
  hot reload. What `bun dev` uses.
- `docker-compose.test.yml` — the stack the end-to-end suite runs against, built
  from the production Dockerfiles so that what is tested is what deploys.
- `Dockerfile` per application — multi-stage, non-root, minimal runtime layer.
  The same file Railway builds, and the same file Fly.io would build after the
  migration in [ADR 0009](./adr/0009-hosting.md).

Integration tests do not use these. They start their own Postgres through
Testcontainers, so that a test run needs no pre-existing state.

## Environment

`.env.example` is committed and lists every variable with a description and a
safe default. It is the documentation of the application's configuration surface;
a variable that is not in it does not exist as far as the project is concerned.

Real values never enter the repository. `gitleaks` runs at pre-commit and in CI,
and the repository is public, so an accidental commit must be assumed scraped the
moment it lands.

## Seed data

`bun db:seed` populates a realistic list using the same faker factories the tests
use, seeded deterministically. One source of test data means a bug reproduced
from a seeded local database is reproducible in a test.

## Useful commands

| Task | Command |
|---|---|
| Start everything | `bun dev` |
| Reset the database | `bun db:reset` |
| Apply migrations | `bun db:migrate` |
| Create a migration | `bun db:generate` |
| Seed development data | `bun db:seed` |
| Regenerate contracts and mocks | `bun gen` |
| Full local gate | `bun verify` |
| Open the Playwright report | `bun test:e2e --ui` |
