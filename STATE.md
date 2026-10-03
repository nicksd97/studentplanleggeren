# Checkout insert investigation

Date: 2026-10-03
Production HEAD: `652a6d87db341b3ce2f9b47473d96538989888f7` (merge of PR #5)
Production deployment: `dpl_2B3KHx3wqrjGvSJ7ynjtT2FUXWSC` READY on www.studentplanlegger.no

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

Vipps fails inside `insertPending` before `createPayment`. Stripe creates a session first, then insert; the shared catch remaps any throw to the Stripe start message.

## What this does and does not prove

- The 502 path does not mark paid and does not email. Confirmed by code: insert is before Vipps, and the insert catch returns 502 without `completeIfPending` or `sendOrderConfirmation`.
- `GET /api/download` 403 is not proof that INSERT can reach Supabase. `download` and `verify` treat any `{error}` or missing row as 403/404.
- `@supabase/postgrest-js` 2.x retries GET three times (1s + 2s + 4s = 7s) and maps a fetch throw to `{error:{code:""}}`. POST is not retried. The 7.2s SELECTs plus 148ms insert-with-no-code match that pattern, but the live thrown message / SQLSTATE / network error has not been captured yet.
- `SUPABASE_SERVICE_ROLE_KEY` is a real `service_role` JWT and is not the anon key. That guess is discarded unless new evidence contradicts it.

## Cause

Not named yet. Waiting on a sanitized insert error (`message`, SQLSTATE, or network code) from a request that does not complete payment.
