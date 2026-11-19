# Translated study planners – status (2026-11-18)

**Done and verified: all 25 planners × 6 languages (en, de, sv, da, es, fr) = 150 PDFs,
plus the 6 translated free samples.** `python3 verify.py` passes for every file and the
review PNGs were inspected visually (see "Visual review" below).

## How to rebuild

```sh
python3 glossary.py              # translation memory -> translations/<slug>.json
python3 translate_planners.py    # source/*.pdf -> out/<lang>/<slug>.pdf  (--lang/--slug filters)
python3 build_samples.py         # out/<lang>/ukentlig-plan.pdf -> out/<lang>/gratis-ukentlig-plan-smakebit.pdf
python3 verify.py                # checks + png/<lang>/<slug>.png (80 dpi), verify-report.json
```

`translate_planners.py --extract` re-creates the JSON skeletons (unit ids, geometry, inferred
alignment) and keeps existing translations and manual layout keys.

## Files

| path | what |
|---|---|
| `translate_planners.py` | extraction of translatable units, removal of the Norwegian glyphs, layout + drawing of the translations |
| `glossary.py` | all translation choices (general glossary, per-file meanings, per-unit titles, weekday/meal initial rules, alignment/layout overrides) |
| `translations/<slug>.json` | every text unit of every source page: id, page, source text, font, size, bbox, alignment, chain, and the six translations (reviewable; the build reads these) |
| `build_samples.py` | translated free samples |
| `verify.py` | verification + PNG rendering |
| `fonts/` | OFL fonts used (static instances made with fontTools from github.com/google/fonts) + licences in `fonts/dl/` |
| `build-info/<lang>/<slug>.json` | which units each build re-drew (used by verify.py) |

## Verification (all PASS)

For every output file vs its source: page count and sizes; widget parity (count, field
names, types, rects ≤ 0.5 pt, checkbox states/values, AcroForm /Fields count); page text is
exactly the expected translations plus untouched numbers/times (character multiset equality,
so no Norwegian leftovers and nothing missing, hidden text included); no leftover source
words; every glyph inside the page; every font used by text embedded; and every original
glyph that was kept is painted exactly as in the source (font, size, colour, fill/stroke,
line width). Samples: 1 page, 177 fillable fields, AcroForm rebuilt, link
`https://www.studentplanlegger.no/<lang>/produkter?utm_source=smakebit&utm_medium=pdf&utm_campaign=gratis-ukeplan`,
text = translated page 1 + badge/banner.

## Visual review done (source vs translation, contact sheets + zoomed crops)

All 25 planners in de, fr, es and in en, sv, da (page 1; page 2 of ukentlig-plan,
aarlig-planlegger, maanedlig-gjennomgang), plus zoomed crops of titles, habit/weekday
initials, label+field rows, budget headers and the sample badge/banner.

## Known limitations / judgement calls

* Myriad Pro → Source Sans 3, Garamond Premier Pro → EB Garamond, Minion Pro → Crimson Pro,
  Gill Sans MT → Cabin (only in daglig-produktivitetsplan; the other fonts are the same OFL
  families as the originals).
* 47 of 2 732 re-laid-out labels are slightly reduced in size to fit (all ≥ 0.83; only
  es "Piensa en Positivo" in daglig-planlegger is below 0.85).
* Single-letter columns use language conventions: weekdays en MTWTFSS, de MDMDFSS,
  sv/da MTOTFLS, es LMXJVSD, fr LMMJVSD; meals (Norwegian F L M K + V for water):
  en B L D S W, de F M A S W, sv F L M K V, da M F A S V, es D A C M AG, fr P M S C E
  (petit-déj, midi, soir, collation, eau).
* German compound titles are drawn as one word in two weights (e.g. WOCHEN**PLAN**,
  MONATS**BUDGET**), same for some sv/da titles. es/fr titles keep the bold/light weights
  per word position (e.g. PLAN **SEMANAL**).
* Text in the letter-spaced title of daglig-timeplan extracts as spaced letters
  ("T A G E S"), exactly like the original ("D A G E L I G").
* Source typos are not carried over (translations are written from the intended meaning);
  nothing else was changed.
* Note: generating the static fonts overwrote the two pre-existing files
  `fonts/Montserrat-Regular.ttf` and `fonts/JosefinSans-Medium.ttf` with fresh static
  instances of the same OFL families from google/fonts (the old ones were not backed up).
