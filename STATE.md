# Checkout insert investigation

Date: 2026-10-03
Production HEAD: `652a6d87db341b3ce2f9b47473d96538989888f7` (merge of PR #5)
Production deployment: `dpl_2B3KHx3wqrjGvSJ7ynjtT2FUXWSC` READY on www.studentplanlegger.no
Branch: `cursor/checkout-insert-pending-bfbb`
PR: https://github.com/nicksd97/studentplanleggeren/pull/6

## Reproduced on production (no payment, no email)

| Request | Result | Duration |
| --- | --- | --- |
| `POST /api/orders` empty body | 400 `Ugyldig betalingsmetode` | fast |
| `POST /api/orders` vipps, missing fields | 400 `Mangler påkrevde felt` | fast |
| `POST /api/orders` unknown product | 400 `Ukjent produkt` | fast |
| `POST /api/orders` `daglig-gjennomgang` 49 kr vipps | 502 `{"error":"Kunne ikke opprette ordre"}` no `code` | 0.148s |
| `POST /api/orders` same cart, stripe | 503 `{"error":"Kunne ikke starte kortbetaling"}` | 1.240s |
| `GET /api/download?token=fake&file=planners/daglig-gjennomgang.pdf` | 403 | 7.2s |
| `GET /api/orders/verify?token=fake` | 404 | 7.2s |

Vipps fails inside `insertPending` before `createPayment`. Stripe creates a session first; the old shared catch remapped an insert throw to the Stripe start message. This branch splits those catches.

## Cause (from evidence, not a guess)

The pending insert fails because the Supabase JS client never receives PostgREST JSON. The library maps that to `{error:{code:"", message:"TypeError: fetch failed", details}}`.

Evidence:

1. Production insert returns 502 with **no code** in 148ms. `insertPending` only attaches `error.code`. An empty string is stripped from the JSON. `@supabase/postgrest-js` sets `code: ""` when `fetch` throws (see its `then()` catch and fetch-errors tests). A missing column, constraint, or RLS denial would be a Postgres/PostgREST code (`42703`, `23502`, `42501`, `PGRST204`, `PGRST301`) and would appear in the 502 body.
2. Production `GET /api/download` and `GET /api/orders/verify` take **7.2s** then treat `{error}` as 403/404. supabase-js v2.102+ retries GET/HEAD/OPTIONS three times with 1s + 2s + 4s backoff on **network failures** and HTTP 503/520. POST is not retried. That is the 7.2s vs 148ms split.
3. `requireEnv` succeeded: a missing `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` throws before fetch and would make download/verify 500 instantly, not 7.2s 403/404. The service-role-key-is-anon guess is discarded.
4. Preview SSO blocked `web_fetch_vercel_url` / `get_access_to_vercel_url` (403 on the aliases endpoint), so the live Node `cause.code` (`ENOTFOUND`, `ECONNREFUSED`, …) could not be read from the instrumented preview. The thrown message on the client path is still `TypeError: fetch failed` with empty SQLSTATE.

This is a **network / fetch error**, not a SQLSTATE. The connection target is `NEXT_PUBLIC_SUPABASE_URL`. This PR does not change that value.

## What this branch changes

- Sanitized `code` and `details` are returned on insert failure (JWTs/bearer tokens stripped).
- Stripe insert failures stay 502 ordre errors and do not look like a Stripe-account failure.
- Admin client disables auth session persistence/refresh on the server.
- Loopback hosts are rejected with `ECONNREFUSED` and a message that names `NEXT_PUBLIC_SUPABASE_URL` without printing it.
- `insertPending` creates a pending row against a reachable PostgREST mock; payment_status stays `pending`. Failed/cancelled/abandoned confirm paths still do not mark paid or email.

## Not done on production

www.studentplanlegger.no still runs PR #5 until this PR is merged. A production POST will keep returning 502 with no `details` until then. Do not complete a live paid checkout.
