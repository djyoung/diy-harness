# 0002 — API error responses

**Status:** Ready · **Phase:** 0 · **Date:** 2026-09-17

## Why

Every later slice names status codes. Defining the error contract once, before
any of them, means each slice asserts against a shared shape instead of
inventing one — and it means a client can handle failures generically.

## Scope

**In scope.** The error body format, the mapping from domain failure to status
code, and the single place that mapping lives.

**Out of scope.** Authentication and rate-limit errors, which have no
corresponding features.

## Acceptance criteria

**AC-1** — Given any error response, when it is returned, then its content type
is `application/problem+json` and its body follows RFC 9457 with at least `type`,
`title`, `status` and `detail`.

**AC-2** — Given a request body fails schema validation, when it is handled, then
the response is `422` and the body carries an `errors` array of
`{ field, message }`, one entry per failing field.

**AC-3** — Given a request body is not valid JSON, when it is handled, then the
response is `400`.

**AC-4** — Given a request references a todo id that does not exist, when it is
handled, then the response is `404`.

**AC-5** — Given an unexpected exception occurs, when it is handled, then the
response is `500`, the body contains no stack trace or internal detail, and the
full error is logged server-side with a correlation id that also appears in the
response.

**AC-6** — Given any error is produced, when it is mapped to a status code, then
that mapping happens in exactly one module. No route handler constructs an error
response itself.

## Contract

```json
{
  "type": "https://diy-harness.dev/problems/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "The request body did not match the expected schema.",
  "instance": "/todos",
  "correlationId": "01J8...",
  "errors": [{ "field": "body", "message": "Body must not be empty" }]
}
```

## Non-functional

Error responses never leak SQL, file paths or dependency versions. Every `5xx`
is logged at error level with the correlation id.

## Open questions

None.
