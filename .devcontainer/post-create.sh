#!/usr/bin/env bash
# Runs once, when the devcontainer is created.
set -euo pipefail

# Docker creates the node_modules volumes owned by root. Hand them to the
# container user so that `bun install` can write to them.
sudo chown "$(id -u):$(id -g)" node_modules apps/*/node_modules packages/*/node_modules

bun install --frozen-lockfile
docker compose up --detach --wait db
