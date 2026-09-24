FROM mcr.microsoft.com/devcontainers/base:bookworm

# Bun, pinned to the version in the root package.json.
COPY --from=oven/bun:1.4.2 /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx
