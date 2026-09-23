# 0016 — Development happens in the devcontainer

**Status:** Proposed · **Date:** 2026-09-23

## Context

[Local development](../local-development.md) says the goal is that a clean clone
reaches a green `bun verify` with one command, and that what runs locally is what
runs in production. It calls the devcontainer "the supported environment", and it
also has `docker-compose.yml` run both applications in development mode with hot
reload, which is what `bun dev` uses.

That gives two overlapping ways to get a Linux, version-pinned toolchain: the
devcontainer, and a set of development containers started by Compose. Nothing
records whether developing on the host, outside the devcontainer, is supported.

The Compose route has a cost. Each application's directory is bind-mounted for hot
reload, and an anonymous volume over `node_modules` stops the host's dependencies
shadowing the image's. `bun dev` has to renew those volumes to pick up a
dependency change. Inside the devcontainer the same volumes are still needed,
because the devcontainer is Debian (glibc) and the application images are Alpine
(musl), and native packages such as Vite's differ between the two.

## Decision

Development is supported inside the devcontainer only. Developing on the host is
not supported, and the documentation says so.

Inside the devcontainer the applications run directly, using their own `dev`
scripts, and Compose runs only Postgres. `bun dev` starts both. The `dev` stages of
the application Dockerfiles, the application services in `docker-compose.yml`, the
bind mounts and the anonymous volumes are removed.

The production Dockerfiles and `docker-compose.test.yml` are unchanged. They remain
how the end-to-end suite runs and how the applications deploy.

`node_modules` lives on a named volume in `devcontainer.json`, so that Linux
dependencies are not written onto a macOS host's disk. Agents, including Claude
Code, run inside the devcontainer too.

## Consequences

One environment replaces two, so the mismatch between host and container
dependencies goes away, along with the volume workarounds and two Dockerfile
stages. Hot reload no longer passes through a bind mount. The same environment
works in Codespaces and other cloud sandboxes, and a contributor needs Docker and
an editor that supports devcontainers, and nothing else on the host.

Development and production no longer share an operating system or C library:
development runs on Debian, production on Alpine. A problem specific to one is
found by the end-to-end suite, which runs the production images, and not while
developing.

Postgres, Testcontainers and the end-to-end stack run inside Docker-in-Docker,
which is heavier and needs a privileged container. Contributors need Docker and a
devcontainer-capable editor, and the first build is slow. The Playwright UI
(`bun test:e2e --ui`) needs port forwarding or a display from inside the
container. Anything an agent runs against the repository must run in the
container, which changes how agent sessions are started.

Implementing this means rewriting `docker-compose.yml`, removing the `dev` stages,
adding the `node_modules` volume, and updating `docs/local-development.md`.

### Open questions

These are for the reviewer to settle before this is accepted.

- **Docker-in-Docker or Docker-outside-of-Docker.** The first is isolated but
  privileged. The second shares the host's Docker socket, and complicates the
  bind-mount paths that Testcontainers uses.
- **CI toolchain.** Whether CI builds from the devcontainer image, so that both pin
  the same versions, or keeps its own setup.
- **Playwright UI.** The exact way to reach it from the host.

## Alternatives considered

**Keep the Compose development containers.** The applications run on Alpine as
they do in production, and the same command works with or without the
devcontainer. The cost is the bind mounts, the anonymous volumes and their renewal,
and a second Linux environment nested inside the devcontainer. This is the current
design, and it is the alternative to choose if development and production parity
matters more than simplicity.

**Support both host and devcontainer development.** A contributor can use whatever
they have installed. There is then no guarantee about the toolchain, which is the
problem the devcontainer exists to remove, and the difference between the two
environments would be found by whoever hits it.
