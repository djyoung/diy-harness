# Architecture

## Guiding ideas

Three ideas do most of the work here, and where they conflict, they are resolved
in this order.

**Clean architecture.** Dependencies point inward. The domain knows nothing about
HTTP, SQL, React or the network. This is what makes the domain testable in
milliseconds and what makes the ordering algorithm — the only genuinely subtle
thing in the app — verifiable in isolation.

**Deep modules** (Ousterhout). Prefer a narrow interface hiding a substantial
implementation. Shallow modules that merely forward calls add indirection
without hiding complexity, and this codebase should have none of them.

**Contract-first.** One schema definition produces the runtime validator, the
TypeScript types on both sides, the OpenAPI document, the client and the test
mocks. Drift between frontend and backend is not a bug we try to catch in
review; it is a state the build makes unrepresentable.

## Shape

```
                     packages/contracts
                   (Zod schemas — the truth)
                      │            │
        ┌─────────────┘            └──────────────┐
        ▼                                         ▼
   apps/api                                   apps/web
   ┌──────────────────────────┐        ┌──────────────────────────┐
   │ routes/      HTTP edge   │        │ components/   markup     │
   │   validate, map errors   │        │   dumb, one job each     │
   ├──────────────────────────┤        ├──────────────────────────┤
   │ services/    use cases   │        │ hooks/        effects    │
   │   orchestrate, transact  │        │   TanStack Query         │
   ├──────────────────────────┤        ├──────────────────────────┤
   │ domain/      pure logic  │        │ api/          generated  │
   │   ordering, invariants   │        │   typed client           │
   ├──────────────────────────┤        └──────────────────────────┘
   │ repositories/ Drizzle    │
   └──────────────────────────┘
              │
              ▼
          Postgres
```

Arrows point from callers to callees. Nothing in `domain/` imports from any
layer above it or from any library other than the standard one.

## Layers, and what each may not do

| Layer | Responsibility | Must not |
|---|---|---|
| `routes/` | Parse and validate input, call one service, map result to a status code | Contain business rules or touch Drizzle |
| `services/` | Orchestrate a use case, own the transaction boundary | Know about HTTP, or build SQL directly |
| `domain/` | Pure rules: ordering keys, state transitions, invariants | Import anything with I/O |
| `repositories/` | All Drizzle access; the only place tables are referenced | Contain business rules |
| `components/` | Render markup from props | Fetch data or hold server state |
| `hooks/` | Server state, side effects, optimistic updates | Render markup |

The repository rule is the one most likely to erode: every read of the todos
table composes from a single base query, so that if a filter (soft delete,
per-user scoping) is ever introduced, it is added in exactly one place.

## Data model

```
todos
  id           uuid        primary key, generated
  body         text        not null, 1..1000 chars
  position     text        not null, fractional index key, unique
  is_complete  boolean     not null, default false
  created_at   timestamptz not null, default now()
  modified_at  timestamptz not null, default now()

  index (position)
```

`position` is a **fractional index**: an opaque, lexicographically sortable
string. Ordering is `ORDER BY position ASC`. Moving one todo writes exactly one
row, whatever the list length, and two concurrent moves cannot corrupt each
other's neighbours. See [ADR 0004](./docs/adr/0004-fractional-indexing.md).

The key generator is pure and lives in `domain/ordering.ts`. It is the deepest
module in the codebase and carries property-based tests: for any valid pair
`a < b`, `a < generateKeyBetween(a, b) < b`.

## API

REST over JSON. Full detail in the numbered specs; the surface is:

| Method | Path | Success | Notes |
|---|---|---|---|
| `GET` | `/todos` | 200 | Ordered by position |
| `POST` | `/todos` | 201 + `Location` | Appends to the end |
| `GET` | `/todos/:id` | 200 | 404 if unknown |
| `PUT` | `/todos/:id` | 200 | Full replacement |
| `PATCH` | `/todos/:id` | 200 | Partial; used for completion toggle |
| `DELETE` | `/todos/:id` | 204 | Hard delete; 404 if unknown |
| `POST` | `/todos/:id/move` | 200 | Body `{ beforeId?, afterId? }` |

`move` is a deliberate exception to resource purity. The client states *intent*
— where the item was dropped — and the server derives the key. Letting the
client compute position keys would put an invariant of the data model outside
the boundary that enforces it.

Errors use Problem Details (RFC 9457): `400` malformed, `404` unknown, `409`
conflicting move, `422` validation failure with field-level detail, `500`
otherwise. The mapping from domain failure to status code lives in one place.

## Frontend composition

`TodoPage` composes `TodoComposer`, `TodoList` and `TodoItem`. Only hooks talk
to the network. Completion and reordering are optimistic: the cache updates
immediately, and on error the previous snapshot is restored and a message is
shown. The rollback path is explicitly tested — it is the part that breaks
silently.

Drag and drop uses dnd-kit with keyboard support, which is both an accessibility
requirement and what makes reordering testable end to end without synthetic
pointer gymnastics.

## Known seams

Deliberate omissions, each an additive change later:

- **Authentication.** No `userId`. Adding one means a column, a middleware and a
  scope parameter on the repository base query.
- **Soft delete.** Hard delete today; a nullable `deleted_at` and a filter on the
  base query if ever needed. See [ADR 0008](./docs/adr/0008-hard-delete.md).
- **Optimistic concurrency.** No `version` column; last write wins, which is
  acceptable for a single-user list.
- **Pagination.** `GET /todos` returns everything. Fine to a few thousand rows.
