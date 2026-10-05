# Gratis lead magnet — implemented, awaiting ops

Date: 2026-10-05
Production HEAD at branch start: `2131435`
Branch: `cursor/gratis-lead-magnet-plan-e27b`

## Status

Feature implemented on this branch. **Do not merge** until Nick sets Vercel/Supabase ops below. Live signup cannot deliver the PDF until the smakebit is in Storage and `RESEND_LEAD_SEGMENT_ID` is set.

Plan: `plans/2026-10-05-gratis-lead-magnet.md`

## What shipped

- `/gratis` landing page (Bokmål), Header/Footer links, homepage band posts to the same API
- `POST /api/newsletter`: validate, honeypot, 5/hour rate limit, Resend Contact + segment, lead mail with signed URL
- From-address `Studentplanlegger <hei@studentplanlegger.no>` for order mail and lead mail
- `/personvern` newsletter/lead purpose
- `/gratis` in `indexablePaths` / sitemap (priority 0.7)
- Beehiiv TODO removed
- Prices / Vipps / Stripe / `productFileMap` unchanged

## New Vercel env (no secret values)

Already present: `RESEND_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

| Name | Required | What Nick puts there |
|---|---|---|
| `RESEND_LEAD_SEGMENT_ID` | Yes for go-live | UUID of Resend segment named `lead-gratis-ukeplan` (Production + Preview) |
| `LEAD_MAGNET_STORAGE_PATH` | No | Default in code: `leads/gratis-ukentlig-plan-smakebit.pdf` |

`RESEND_API_KEY` must be **full-access** (Contacts + Emails), not sending-only.

## PDF upload (Nick)

This agent has no Supabase credentials, so the file was not uploaded.

1. File: `gratis-ukentlig-plan-smakebit.pdf` (1 page, GRATIS SMAKEBIT). Agent copy: `/home/ubuntu/.cursor/projects/workspace/uploads/gratis-ukentlig-plan-smakebit_3dd0.pdf`.
2. Supabase Storage → bucket **`products`** (keep private).
3. Object path: **`leads/gratis-ukentlig-plan-smakebit.pdf`**.
4. Do **not** upload or link `24. Ukentlig Plan.pdf` / `planners/ukentlig-plan.pdf`.

## Local verification

- `npm test`: 93/93
- `next build`: `/gratis` static
- Invalid email → 400; honeypot → 200; 6th signup/hour → 429
- Valid signup locally → 500 `Kunne ikke lage nedlastingslenke` until Storage + Resend env exist

## Not done

Do not merge. Do not complete a live paid checkout. Live mail/PDF check waits on the env/upload above.
