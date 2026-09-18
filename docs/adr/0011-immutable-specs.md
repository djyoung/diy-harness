# 0011 — Specs are numbered and immutable

**Status:** Accepted · **Date:** 2026-09-17

## Context

Specs are the feedforward half of the harness: they are what an agent reads to
know what to build and when it is done. Their trustworthiness as a record is
therefore load-bearing.

## Decision

Every spec in `docs/specs/` carries a zero-padded numeric prefix, and is
**immutable** once written. Changed requirements produce a new numbered spec that
supersedes the old one. Both files record the supersession. Nothing is ever
renumbered.

## Consequences

The numeric prefix makes the directory listing reflect the order in which slices
were specified and are intended to be built, rather than sorting alphabetically
by feature name and scattering related work.

Immutability means a pull request, a review comment or a roadmap entry that cites
a spec number still refers to exactly the text its author read. This matters more
than usual here because agents pick up work from these files: if specs could be
edited in place, the provenance of an agent's decisions would be unverifiable
after the fact, and post-hoc review of *why* something was built a certain way
would be guesswork.

Typo corrections are not an exception. Any edit breaks the guarantee that makes
the archive worth keeping, and the cost of a superseding file is one minute.

The cost is a longer directory over time, and the need to check for supersession
before implementing. The index in `docs/specs/README.md` carries the current
status of each.
