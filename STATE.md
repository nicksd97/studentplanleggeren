# Checkout insert investigation

Date: 2026-10-03
Production HEAD: `dff328a9cd241e5c2d1e029610a1dd87daa8b370` (merge of PR #6)
Production deployment: `dpl_G2f4w7pA4SK9QRK5M76X6QYxMAdU` READY
Aliases include `www.studentplanlegger.no`

## Live probe after PR #6 (no payment, no email)

One non-paying `POST https://www.studentplanlegger.no/api/orders` for `daglig-gjennomgang` at 49 kr with `paymentProvider: vipps`:

- HTTP **502**
- Sanitized body: `{"error":"Kunne ikke opprette ordre","code":"ENOTFOUND","details":"TypeError: fetch failed | TypeError: fetch failed\n\nCaused by: Error: getaddrinfo ENOTFOUND ipofspmzdjshjtcsdzcx.supabase.co (ENOTFOUND)\nError: getaddrinfo ENOTFOUND ipofspmzdjshjtcsdzcx.supabase.co\n    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:123:26)"}`
- Follow-up `GET /api/orders/verify?token=probe-not-a-real-download-token` → 404 `Ordre ikke funnet`
- Nothing was marked paid. No download token was returned. Vipps was not started.

## Cause

`getaddrinfo ENOTFOUND` for the host in `NEXT_PUBLIC_SUPABASE_URL`. The Supabase JS client fetch never reaches PostgREST. Empty SQLSTATE on the old 502 matches this: `@supabase/postgrest-js` sets `code: ""` on a fetch throw. A missing column, constraint, RLS denial, or a wrong service-role key would have been an HTTP/PostgREST code, not DNS `ENOTFOUND`.

Env values were not changed.

## Earlier production reproduction (before PR #6)

| Request | Result | Duration |
| --- | --- | --- |
| Vipps catalog POST | 502 `Kunne ikke opprette ordre` no `code` | 0.148s |
| Stripe catalog POST | 503 `Kunne ikke starte kortbetaling` | 1.240s |
| `GET /api/download` fake token | 403 | 7.2s |
| `GET /api/orders/verify` fake token | 404 | 7.2s |
