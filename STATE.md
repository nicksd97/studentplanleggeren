# Ekte smakebit og datoer — PR open, not merged

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
