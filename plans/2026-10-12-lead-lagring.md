# Lead-lagring og velkomstserie

Date: 2026-10-12
Branch: `cursor/lead-lagring-340d`

## Goal

Store every collected email lead in Supabase with source, consent and campaign history, and start the Resend welcome automation for **new** `/gratis` (and forside) signups only.

## Architecture

`POST /api/newsletter` stays the only signup path. After the existing Resend contact upsert and smakebit-mail, new contacts get `resend.events.send({ event: "studentplanlegger.gratis_signup", email })`. That custom event is what the enabled Resend automation «Studentplanlegger gratis – velkomstserie» listens for.

Leads are written with the service role only. RLS is on; `anon` / `authenticated` have no grants. First-touch UTM comes from the `sp_campaign` cookie (and optional POST `campaign`), same merge as checkout.

Existing Resend segment contacts are imported with a **manual** script. Backfill marks the sample campaign only and never fires the welcome event.

## Decisions

| Topic | Choice |
|---|---|
| Welcome trigger | Custom event `studentplanlegger.gratis_signup` after contact + smakebit mail |
| Who gets the series | New Resend contacts only (`contacts.create` succeeded). Existing contacts still get the sample mail if they submit again. |
| Event failure | try/catch + `{ error }` check. Signup still returns 200 if the sample mail was sent. |
| Lead DB failure | try/catch after the mail. Never breaks signup. |
| Source | `gratis-ukeplan` (both `/gratis` and the forside form) |
| Campaign keys | `gratis-sample` (status `sent`) and `velkomstserie` (status `enrolled`) |
| UTM | First-touch. Later signups do not overwrite existing `utm_*`. |
| Backfill | `npm run backfill-leads`. Default is dry-run. `--apply` writes. Not in build/test/CI. |
| ESP | Resend only. No second list. |

## Tables

`supabase/migrations/2026-10-12-leads.sql` (also appended to `scripts/schema.sql`).

`leads`: `id`, `email` (unique), `source`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `created_at`, `consent_at`, `consent_source`, `unsubscribed`, `unsubscribed_at`.

`lead_campaigns`: `id`, `lead_id` → `leads(id)` on delete cascade, `campaign`, `status`, `sent_at`, `enrolled_at`, `created_at`, unique `(lead_id, campaign)`.

## Handler order

1. Validate, honeypot, rate-limit, signed URL (unchanged).
2. Resend `contacts.create` / `contacts.segments.add` (unchanged). `create` without error ⇒ new signup.
3. `sendLeadMagnetEmail` (unchanged).
4. If new: `resend.events.send({ event: "studentplanlegger.gratis_signup", email })` in try/catch.
5. Upsert `leads` + `gratis-sample`. Record `velkomstserie` only when the event send succeeded.

## Backfill

`scripts/backfill-resend-leads.ts` pages `resend.contacts.list({ segmentId })` with `limit`/`after`/`has_more`. Writes `source=gratis-ukeplan`, `consent_source=resend-backfill`, `gratis-sample` only. Does not call `events.send`. Prints counts, never emails or keys.

```bash
# dry-run (default)
npm run backfill-leads

# write
npm run backfill-leads -- --apply
```

Needs the same server env as the app: `RESEND_API_KEY`, `RESEND_LEAD_SEGMENT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Personvern

`/personvern` now states that leads live in both Resend and Supabase, that we store source / UTM / consent / campaign history, that we send a welcome series, and that `sp_campaign` is a first-party campaign cookie (not a third-party tracker). Updated 12. oktober 2026.

## File map

- Create: `plans/2026-10-12-lead-lagring.md` (this file)
- Create: `supabase/migrations/2026-10-12-leads.sql`
- Create: `lib/leads.ts`, `lib/leads.test.ts`
- Create: `scripts/backfill-resend-leads.ts`
- Modify: `app/api/newsletter/route.ts`
- Modify: `lib/newsletter.ts`
- Modify: `components/sections/NewsletterSignup.tsx` (send stored UTM in the POST body)
- Modify: `app/personvern/page.tsx`
- Modify: `scripts/schema.sql`
- Modify: `package.json` (test file + manual `backfill-leads` script)
- Modify: `STATE.md`

## Out of scope

- Merging this PR
- Running the backfill against production
- Changing checkout, prices, Vipps/Stripe, or paid PDF paths
- A public unsubscribe API (mailto + List-Unsubscribe stay as they are)
- Printing or committing secrets
