# Selvhostede fonter (fix for failed deploy of #15) — PR open, not merged

Date: 2026-10-06
Branch: `cursor/selvhostede-fonter-6edf`

- `app/layout.tsx` loaded Playfair Display and DM Sans with `next/font/google`, which downloads from Google Fonts during `next build`. If that download fails, the build fails. They are now self-hosted with `next/font/local` from `app/fonts/` (latin woff2 + OFL licences).
- Nick, after merge: check that the production deploy is READY. Then the #15 email image is live too.

---

# Ny /gratis-e-post — merged (#15), production deploy failed (see above)

Date: 2026-10-06
Branch: `cursor/gratis-epost-6edf`
Plan and research: `plans/2026-10-06-gratis-epost.md`

## Status

- The lead-magnet email is rebuilt in `lib/lead-magnet-email.ts`. It uses table layout with inline CSS, a VML button for Outlook, dark mode support, a plain-text part and a `List-Unsubscribe` header. `lib/email.ts` only wires it in; the route and download/token logic are unchanged.
- Subject: «Smakebiten av Ukentlig Plan er klar». Preheader: «Mandag–onsdag som fyllbar PDF. Last ned nå – lenken virker i 7 dager.»
- Image: `public/images/email/smakebit.png` (rebuild with `python3 scripts/build-email-images.py`). The email links to it as `https://www.studentplanlegger.no/images/email/smakebit.png`.
- Upsell: Ukentlig Plan 39 kr and Komplett 249 kr, as plain links with UTM tags. No urgency, reviews or before-prices.
- No emails were sent. Previews are browser renders; there are no real Litmus or Email on Acid screenshots.

## Nick, after merge

1. Deploy before the next `/gratis` signup, so the image URL is live.
2. Optional: send yourself a test via `/gratis` and check it in Gmail, Outlook and the iPhone Mail app.

---

# PDF-skrivefeil og produktbilder — merged (#14)

Date: 2026-10-06
Branch: `cursor/pdf-skrivefeil-6edf`
Plan: `plans/2026-10-06-pdf-skrivefeil.md`

## Status

- Typos fixed in 8 paid PDFs: `ukentlig-plan`, `30-dagers-utfordring`, `ukentlig-gjoremaal`, `vane-tracker`, `ukentlig-matplan`, `daglig-gjennomgang`, `daglig-helseplan`, `daglig-planlegger`. Details: `assets/planners-updated/README.md`. The fixed PDFs are **not** in git; rebuild with `python3 scripts/fix-planner-typos.py` (sources in `assets/source/`, output in `assets/source/fixed/`).
- Product thumbnails: 6 showed the wrong planner and were rebuilt; 5 more rebuilt to show fixed text. `python3 scripts/build-product-thumbnails.py --audit` checks all 25 against `lib/products.ts` (needs poppler `pdftoppm`).
- Free sample and site images rebuilt from the fixed `ukentlig-plan.pdf` / `daglig-planlegger.pdf`.
- Known, not fixed: the hero photo's banner says «ÅRLIG PLANLEGER» and «DAGELIG PLANLEGGER» (baked into the photo).

## Nick, after merge

1. Upload the 8 fixed PDFs to Supabase `products/planners/<slug>.pdf` (overwrite, same filenames).
2. Upload `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf` to `products/leads/gratis-ukentlig-plan-smakebit.pdf` (overwrite).

---

# Ekte smakebit og datoer — merged (#13)

Date: 2026-10-06
Branch: `cursor/ekte-smakebit-og-datoer-6edf`
Plan: `plans/2026-10-06-ekte-smakebit-og-datoer.md`

## Status

- New free sample: `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf`. It is page 1 of the real `ukentlig-plan.pdf` (mandag–onsdag, 177 fillable fields) plus a «Gratis smakebit» badge and bottom bar. Rebuild with `python3 scripts/build-lead-magnet.py assets/source/ukentlig-plan.pdf`.
- Planner PDFs: none of the 25 have visible outdated dates, so none were changed. Audit and non-date typos: `assets/planners-updated/README.md`.
- Site: the hero image and the front-page «Årlig, månedlig, ukentlig og daglig» card showed 2023/2024 year calendars. Both now show real undated planner pages (`scripts/build-site-images.py`). Three unused images that showed 2023 were deleted.

## Nick, after merge

Upload `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf` to Supabase bucket `products` at `leads/gratis-ukentlig-plan-smakebit.pdf` (overwrite the old hand-built sample). Until then, `/gratis` emails still link the old sample.

## Rules for later work

The GitHub repo is public. Never commit paid planner PDFs. Keep source copies in `assets/source/` (git-ignored) and upload fixed PDFs straight to Supabase `products/planners/`.

---

# Linjeforening rabattkoder — merged (#12)

SQL Nick must run in the Supabase SQL Editor before the discount codes work: `supabase/migrations/2026-10-06-discount-codes.sql` (creates `discount_codes`, adds order columns, seeds the 15 linjeforening codes at 20 %, expiring 2026-12-31 23:59 Europe/Oslo). If the table is missing, a submitted code is treated as invalid; checkout without a code uses catalog prices.

Komplett copy matches delivery: 25 planner PDFs only (no papirmaler).
