# Gratis lead magnet — plan only

Date: 2026-10-05
Production HEAD at branch start: `2131435` (new prices merged)
Branch: `cursor/gratis-lead-magnet-plan-e27b`

## Status

Plan written. **No feature code.** Awaits Nick’s go before any `/gratis` build.

Plan file: `plans/2026-10-05-gratis-lead-magnet.md`

## Locked choices

- Resend Contacts + segment `lead-gratis-ukeplan`; from `Studentplanlegger <hei@studentplanlegger.no>` (domain verified 2026-10-05).
- 1-page smakebit PDF only — never `24. Ukentlig Plan.pdf`.
- Signed URL from private Supabase bucket `products` / `leads/gratis-ukentlig-plan-smakebit.pdf`.
- Drop Beehiiv. Do not touch Vipps/Stripe/prices (39 / 99 / 149 / 249).

## Ops still needed before go-live (not this PR)

- Upload smakebit to Supabase Storage.
- Create Resend segment + set `RESEND_LEAD_SEGMENT_ID`.
- Confirm `RESEND_API_KEY` is full-access.

## Not done

Do not implement the landing page, API, or mail until Nick says go. Do not merge a feature PR from this plan yet.
