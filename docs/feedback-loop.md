# The feedback loop

This document describes the discipline that makes the whole project work. It is
short because the idea is simple and the difficulty is entirely in doing it
every time.

## The rule

**Every human correction is a harness defect.**

When a reviewer has to explain something to an agent — a missed error case, a
wrong layer, a convention not followed, a question that should not have needed
asking — fixing the branch is only half the work. The other half is asking why
the agent did not already know, and repairing the thing that should have told
it.

Fixing only the branch means the same correction is made again next week. That
is not review; it is manual labour disguised as review.

## Where a correction goes

| The agent... | Fix belongs in |
|---|---|
| did not know a convention | `AGENTS.md` |
| did not know a requirement | a new spec, superseding if needed |
| made a mistake a rule can catch | a lint rule, a type, a schema constraint |
| made a mistake a test can catch | a test, plus the testing strategy if it is a class of mistake |
| made a mistake only a human notices | the CodeRabbit rubric in `.coderabbit.yaml` |
| asked a question it should not have needed to ask | whichever document should have answered it |
| did not ask a question it should have asked | the escalation list in `AGENTS.md` §7 |

Prefer the mechanical fix over the written one. A lint rule is checked every
time; a sentence in a document is only as good as the reading. Write prose when
the rule cannot be expressed mechanically — which is most architectural
judgement, and very little syntax.

## The ratchet

Gates only tighten. Coverage thresholds, lint strictness and type strictness go
up, never down. If a change cannot pass a gate, the change is wrong, or the gate
is wrong and gets its own pull request with its own reasoning — never a quiet
loosening inside a feature branch.

## Review the harness, not just the code

At the end of each phase, and after any run of ten agent pull requests:

1. Read the findings from those pull requests together, not individually.
2. Group them. Three instances of the same class is a systemic gap, not three
   mistakes.
3. Fix the largest group at its source.
4. Record the metrics from [roadmap.md](./roadmap.md) so the trend is visible.

The single most useful number is findings per pull request over time. If it is
flat, the loop is not closing — corrections are being applied to branches
instead of to the harness, and the project is running on human attention rather
than on engineering.
