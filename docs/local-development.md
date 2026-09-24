# Local development

The goal is that a clean clone reaches a green `bun verify` with one command, and
that what runs locally is what runs in production. Every deviation from that is a
place where the harness will eventually lie to an agent about whether its work is
correct.

## Devcontainer

Development happens inside the devcontainer, and only there
([ADR 0016](./adr/0016-devcontainer-only-development.md)). Developing directly on
the host is not supported. Agents, including Claude Code, run inside it too.

`.devcontainer/devcontainer.json` pins Bun, Node, Docker-in-Docker and the editor
extensions for Biome and Tailwind, so that toolchain drift between contributors —
human or otherwise — cannot cause a failure that only reproduces on one machine.
On the host you need Docker and one of the two ways in described below, and
nothing else.

Inside the container the applications run directly, from their own `dev`
scripts, and Compose runs only Postgres. `bun dev` starts Postgres and then both
applications, with hot reload:

| Service | Address from the host |
|---|---|
| Web (Vite) | <http://localhost:5173> |
| API | <http://localhost:3000> (`/health` answers when it is up) |
| Postgres | `localhost:5432`, user and password `postgres`, database `diy_harness` |

Every `node_modules` directory lives on a named Docker volume, so Linux
dependencies are never written to the host's disk. Bun gives each workspace its
own `node_modules`, so a new workspace needs its own entry under `mounts` in
`devcontainer.json`. When the container is created, `.devcontainer/post-create.sh`
installs dependencies and starts Postgres, so the container comes up usable
rather than merely running.

The ports are declared twice in `devcontainer.json`: `forwardPorts` for VS Code,
and `appPort` for the command line interface, which ignores `forwardPorts`.
`appPort` publishes the ports on the host, so only one devcontainer — one clone
or worktree — can be running at a time.

There are two supported ways in. Each section below is complete on its own.

### VS Code

Needs VS Code with the
[Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
extension.

| Task | How |
|---|---|
| Start | Open the repository folder, then run **Dev Containers: Reopen in Container** from the command palette. The first build takes several minutes. |
| Run the applications | In a VS Code terminal (which runs inside the container): `bun dev` |
| Run the tests and the gate | In a VS Code terminal: `bun verify` |
| Reach the applications | Open the addresses in the table above in a browser on the host. The **Ports** panel lists them. |
| Stop | **Dev Containers: Reopen Folder Locally**, or close the window. VS Code stops the container. |
| Rebuild | **Dev Containers: Rebuild Container**, after a change to anything in `.devcontainer/`. |

### Command line

Needs the [devcontainer CLI](https://github.com/devcontainers/cli)
(`npm install -g @devcontainers/cli`). Run these from the repository root on the
host.

| Task | Command |
|---|---|
| Start | `devcontainer up --workspace-folder .` |
| Open a shell inside | `devcontainer exec --workspace-folder . bash` |
| Run the applications | `devcontainer exec --workspace-folder . bun dev` |
| Run the tests and the gate | `devcontainer exec --workspace-folder . bun verify` |
| Reach the applications | Open the addresses in the table above in a browser on the host. |
| Stop | `docker stop $(docker ps -q --filter "label=devcontainer.local_folder=$PWD")` |
| Rebuild | `devcontainer up --workspace-folder . --remove-existing-container` |

The command line interface has no command to stop a container, hence the
`docker stop`. A later `devcontainer up` starts the same container again.

## Docker

Two compositions and a Dockerfile per application:

- `docker-compose.yml` — Postgres, for development. What `bun dev` starts.
- `docker-compose.test.yml` — the stack the end-to-end suite runs against, built
  from the production Dockerfiles so that what is tested is what deploys.
- `Dockerfile` per application — multi-stage, non-root, minimal runtime layer.
  The same file Railway builds, and the same file Fly.io would build after the
  migration in [ADR 0009](./adr/0009-hosting.md).

Development runs on the devcontainer's Debian, production on Alpine. A problem
specific to one of them is caught by the end-to-end suite, which runs the
production images, not while developing.

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
