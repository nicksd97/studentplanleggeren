# Skrivefeil i planlegger-PDF-ene og feil produktbilder

Date: 2026-10-06
Branch: `cursor/pdf-skrivefeil-6edf`
Follows: `plans/2026-10-06-ekte-smakebit-og-datoer.md` (#13)

**Goal:** Fix the typos in the paid planner PDFs without changing layout or form fields, and make every product thumbnail show its own planner.

## Constraints

- The repo is **public**: never commit paid planner PDFs. Sources in git-ignored `assets/source/`, fixed copies in git-ignored `assets/source/fixed/`, handed to Nick as artifacts.
- Match the existing font, size and colour exactly. Keep every form field working.
- No price, checkout, Vipps/Stripe or discount-code changes. No Supabase access.
- One PR against `master`. Do not merge.

## Decisions

| Topic | Choice |
|---|---|
| How to edit | Byte-exact replacements in the page content streams, each with an asserted hit count (`scripts/fix-planner-typos.py`). No re-typesetting. |
| Missing glyphs | When the embedded subset lacks a letter (TORSDAG «S», vane-tracker «O»/«L», matplan «L»), use another embedded font of the same face if the page has one; otherwise delete the old glyph and draw the new one at its centre on the same baseline with the full OFL font, subset to just the new glyphs. |
| Fonts | `pymupdf.subset_fonts()` is not used: it would also subset the fonts form fields type with. |
| Extra typos | Fixed the same kinds in other files (TIRDAG, English weekday initials, matplan Saturday). Also fixed the «Dagelig» product titles and «VANN INTAK». English headings and «Uke:» on the year plan are listed, not changed. |
| Thumbnails | Rendered like the originals: poppler `pdftoppm -r 200 -aaVector no` (gives the same crisp 2 px lines), JPEG with the existing quantization tables, 4:2:0 and «Display» ICC profile. Size follows the PDF's page (A4 1654×2339, Letter 1700×2200). |

## Tasks

### Task 1: Fix script

- [x] `scripts/fix-planner-typos.py` → `assets/source/fixed/<slug>.pdf`
- [x] `ukentlig-plan.pdf`: 12:00 → 12:30 (page 1, three columns); TORDAG → TORSDAG, 16::00 → 16:00, 22::30 → 22:30, non-embedded time font in fredag–søndag swapped for the embedded one (page 2)
- [x] `30-dagers-utfordring.pdf`: bottom row 30, 31 → 29, 30 (30 boxes and 30 checkboxes already existed)
- [x] `ukentlig-gjoremaal.pdf`: TIRDAG → TIRSDAG
- [x] `vane-tracker.pdf`: M T W T F S S → M T O T F L S (5 rows)
- [x] `ukentlig-matplan.pdf`: Saturday S → L, F L D K → F L M K
- [x] `daglig-gjennomgang.pdf`, `daglig-helseplan.pdf`, `daglig-planlegger.pdf`: DAGELIG/Dagelig → DAGLIG/Daglig; VANN INTAK → VANNINNTAK
- [x] OFL fonts for the overlays in `assets/fonts/`

### Task 2: Verify the PDFs

- [x] Render diff (MuPDF) original vs. fixed: changes only at the edited words
- [x] Zoomed visual check of every edit in MuPDF and pdfium
- [x] Text layer has the new words; field count/names unchanged; a text field fills and saves in every fixed file
- [x] Fixed PDFs + page-1 PNG previews saved as artifacts (`fixed-planners/<slug>.pdf`)

### Task 3: Product thumbnails

- [x] `scripts/build-product-thumbnails.py --audit`: compare each thumbnail from `lib/products.ts` with page 1 of every PDF
- [x] Six showed the wrong planner: `aarlig-planlegger` (Månedlig Budsjett), `daglig-planlegger` (Daglig Timeplan), `daglig-produktivitetsplan` (Daglig Planlegger), `daglig-timeplan` (Daglig Produktivitetsplan), `ukentlig-plan` (Ukentlig Planlegger), `30-dagers-utfordring` (Vane Tracker). Rebuilt
- [x] Thumbnails of the other fixed PDFs rebuilt so they show the corrected text: `daglig-gjennomgang`, `daglig-helseplan`, `ukentlig-gjoremal`, `ukentlig-matplan`, `vane-tracker`
- [x] Audit after: 25 of 25 match

### Task 4: Sample and site images

- [x] `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf` rebuilt from the fixed `ukentlig-plan.pdf` (177 fields)
- [x] `scripts/build-site-images.py` uses `assets/source/fixed/` first; rebuilt `marketing/3.png` (now «Daglig Planlegger») and the hero (12:30 on the pasted Ukentlig Plan page)

### Task 5: Docs and ship

- [x] `assets/planners-updated/README.md`, `STATE.md`
- [x] `npm test` and `npm run build`
- [x] PR against `master` (not merged)

### Task 6: Nick, after merge

- [ ] Upload the 8 fixed PDFs to Supabase `products/planners/<slug>.pdf` (overwrite)
- [ ] Upload `assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf` to `products/leads/gratis-ukentlig-plan-smakebit.pdf` (overwrite)

## Out of scope / follow-up

- The hero photo's banner text says «ÅRLIG PLANLEGER» and «DAGELIG PLANLEGGER», and a few small page mock-ups in it show old titles. That text is part of the photo, not a PDF render.
- English headings in `handlingsplan`, `gjoremaal-liste`, `prosjekt-planlegger`; «Uke:» on page 2 of `aarlig-planlegger`.
