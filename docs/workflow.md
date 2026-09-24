# The vertical slice workflow

Every behavioural change follows this loop. It exists so that the same sequence
works whether a human or an agent is driving, and so that a reviewer always
knows what a pull request should contain.

The worked example below is "move a todo", the hardest slice in the app.

## 0. Precondition — the spec

A numbered spec exists in `docs/specs/` with acceptance criteria written as
Given / When / Then. **No spec, no branch.** This is the feedforward half of the
harness: the spec is what tells an agent when it is done, without asking.

Specs are immutable. If the requirement changed, a new numbered spec supersedes
the old one; the old file stays exactly as it was written.

The same discipline applies to decisions. If the slice depends on a choice that
meets the ADR criteria, the ADR is committed first, on its own, in the draft pull
request, and the code that depends on it follows in later commits. The ADR must
be `Accepted` by a human before the pull request merges. A decision that affects
several slices can instead be merged first in its own pull request. See
[the ADR lifecycle](./adr/README.md#lifecycle).

## 1. Contract first — red by typecheck

Add `MoveTodoRequest` to `packages/contracts`. Nothing implements it, so
`bun typecheck` now fails in both apps. That failure is the first red, and it
establishes the shape of the change before any logic is written.

## 2. Domain — red, green, refactor

`generateKeyBetween(a, b)` as pure TypeScript. Example-based tests for the
boundaries — first item, last item, empty list — plus a property test asserting
the result always sorts strictly between its inputs. No database, no HTTP,
millisecond feedback. This is where the actual thinking happens.

## 3. Persistence and transport — red, green, refactor

Write the failing integration test first: `POST /todos/:id/move` against real
Postgres in Testcontainers with migrations applied. Assert the success case and
every error case the spec names — 404 for an unknown id, 422 for a malformed
body, 409 for a stale neighbour. Then write the migration, the repository
method, the service and the route handler until it is green.

## 4. Regenerate

`bun gen` derives the OpenAPI document from the Zod schemas, then the typed
client and the MSW handlers. Mocks cannot drift from the contract because both
come from the same source. This is the single highest-leverage automation in the
repository; if it is ever bypassed, the whole contract-first argument collapses.

## 5. Interface — red, green, refactor

A component test renders `TodoList` with MSW behind it, performs a
keyboard-driven move, and asserts the optimistic reorder. A second test makes the
handler return 500 and asserts the list rolls back and a message appears. Then
write `useMoveTodo` and keep the components free of effects.

## 6. Journey

One Playwright test against `docker compose up`. It proves the wiring is real —
it is not a third copy of the assertions already made below it.

## 7. Refactor

At each green, never at red. Remove duplication, deepen interfaces, delete
anything the tests do not need.

## 8. Evidence

Playwright writes before and after screenshots to `test-results/`. Attach them
to the pull request for any visible change, and a short video for interaction
changes such as drag and drop. The template will not let you skip this.

## 9. Gates

`bun verify` locally, then push. Pre-commit is fast, pre-push runs tests, CI runs
everything, CodeRabbit reviews, a human approves, the merge deploys. See
[ci-cd.md](./ci-cd.md).

## Size

If the diff exceeds roughly 400 lines, or touches more than one spec, it should
have been two pull requests. Small pull requests are not ceremony here: they are
what makes agent-authored work reviewable, and what makes a bad merge cheap to
revert.

## Why this order

The sequence runs contract → domain → data → interface → journey because each
step's failure message is more precise than the one before it would have been. A
broken typecheck names the file; a broken unit test names the rule; a broken
integration test names the endpoint; a broken end-to-end test only tells you
something is wrong somewhere. Writing the cheap, specific test first means an
agent debugging its own work gets the most informative error available.
