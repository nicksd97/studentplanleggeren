# Ekte smakebit og utdaterte datoer

Date: 2026-10-06
Branch: `cursor/ekte-smakebit-og-datoer-6edf`

**Goal:** (1) The free `/gratis` sample is a real excerpt of the paid `ukentlig-plan.pdf`, not a separately designed mock-up. (2) No planner PDF or site page/image shows an outdated date or year.

## Constraints

- Bokmål copy. No price, checkout, Vipps/Stripe or discount-code changes. No fake reviews or anchor prices. No secrets.
- No Supabase access: Nick uploads the new sample after merge.
- The repo is **public**: never commit paid planner PDFs. Source PDFs go in git-ignored `assets/source/`.
- One PR against `master`. Do not merge.

## Decisions

| Topic | Choice |
|---|---|
| Sample content | Page 1 of `ukentlig-plan.pdf` unchanged (Mål, Prioriteringer, Gjøremål, Vaner, Notater, mandag–onsdag). Page 2 (torsdag–søndag) dropped. |
| Banner | Top-right badge «GRATIS SMAKEBIT · Mandag–onsdag fra Ukentlig Plan» and bottom bar «Gratis smakebit – hele ukeplanen finner du på studentplanlegger.no» in the product's Montserrat and #2b2b2b, in the empty margins. The bar links to `/produkter` with `utm_source=smakebit`. |
| Fillable | Keep all 177 page-1 fields. `Document.select()` drops `/AcroForm`, so the script rebuilds it. |
| Planner PDFs | None have visible dates. Not touched. File metadata dates (2022–2023) left as is. |
| Site images | Replace the dated 2023/2024 calendar pages with real undated pages; delete unused images that still show 2023. |

## Tasks

### Task 1: Real sample PDF

- [x] `scripts/build-lead-magnet.py <ukentlig-plan.pdf>` → `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf`
- [x] Sanity checks in the script: source is the 2-page Ukentlig Plan, output is 1 page without fredag–søndag, all 177 fields kept
- [x] Embed Montserrat (OFL, `assets/lead-magnet/fonts/`), subset fonts (224 KB), Lang `nb-NO`, Bokmål title, old XMP removed
- [x] Verify: render diff vs. the real page 1 is only the badge and the bottom bar; fields fill in PyMuPDF and pypdf
- [x] Preview PNG of page 1

### Task 2: Date audit of the 25 planner PDFs

- [x] Render every page (28) and check visually
- [x] Search the text layer, form-field values, layers, images and metadata
- [x] Result: no outdated dates. `assets/planners-updated/README.md` documents the method, the result and non-date defects found

### Task 3: Date audit of the site

- [x] Grep `app/`, `components/`, `lib/` for years, months, semester words and JSON-LD date fields. Only current dates (© 2026, personvern 5. oktober 2026, vilkår 12. april 2026)
- [x] Visual check of every image in `public/images/`
- [x] `public/images/marketing/3.png` (front page card «Årlig, månedlig, ukentlig og daglig») showed 2023 and 2024 year calendars → rebuilt from real Årsplan, Månedlig Plan, Ukentlig Plan and Daglig Planlegger pages
- [x] `public/images/brand/Front page cover photo rev.2.png` (hero) showed a 2023 year calendar → that page replaced in place with Ukentlig Plan page 1, with the neighbouring pages' shadows recreated
- [x] Deleted unused `public/images/hero-showcase.png`, `public/images/brand/cover-photo.png`, `public/images/brand/Front page cover photo.pdf` (all showed 2023, no references)
- [x] `scripts/build-site-images.py` regenerates both images (hero always starts from the original in git, so output is deterministic)
- [x] `/gratis` bullets describe the sample as a real Ukentlig Plan page

### Task 4: Verify and ship

- [x] `npm test`, `npm run lint`, `npm run build`
- [x] Front page and `/gratis` checked in the browser
- [x] PR against `master` (not merged)

### Task 5: Nick, after merge

- [ ] Upload `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf` to Supabase bucket `products` at `leads/gratis-ukentlig-plan-smakebit.pdf` (overwrite)
- [ ] Optional: fix the product typos listed in `assets/planners-updated/README.md` and upload the fixed PDFs directly to Supabase (not to git)

## Out of scope

- Product-image mapping on product cards (several thumbnails show a different planner than their product; see the PR description)
- Fixing non-date typos inside the paid PDFs
