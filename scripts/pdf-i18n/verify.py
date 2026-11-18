#!/usr/bin/env python3
"""Verify the translated planners against their sources and render review PNGs.

    python3 verify.py [--source source] [--translations translations] [--out out]
                      [--png png] [--lang de] [--slug ukentlig-plan] [--dpi 80]

Checks per output file:
  * page count and page sizes equal to the source
  * widget parity: same count, field names, types, rects (<= 0.5 pt), checkbox
    states/values, and the same number of AcroForm /Fields
  * text: the characters on each page are exactly the expected translations
    plus the untranslated units (numbers, times) - i.e. no Norwegian leftovers
    and nothing missing; and no source string of a translated unit survives
  * every glyph lies inside the page
  * every font used by text is embedded
Renders every page to png/<lang>/<slug>.png (page 2+: <slug>-p2.png ...).
The free samples (gratis-*.pdf) are checked for widgets/fonts/bounds only.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent
LANGS = ["en", "de", "sv", "da", "es", "fr"]


def widgets(doc):
    out = []
    for page in doc:
        for w in page.widgets():
            out.append((page.number, w.field_name, w.field_type_string, tuple(w.rect), str(w.field_value)))
    return out


def acro_count(doc) -> int:
    kind, val = doc.xref_get_key(doc.pdf_catalog(), "AcroForm/Fields")
    if kind == "xref":
        val = doc.xref_object(int(val.split()[0]))
    elif kind != "array":
        return 0
    return val.count(" R")


def compare_widgets(a, b) -> list[str]:
    errs = []
    if len(a) != len(b):
        return [f"widget count {len(b)} != {len(a)}"]
    for x, y in zip(a, b):
        if x[0] != y[0] or x[1] != y[1] or x[2] != y[2] or x[4] != y[4]:
            errs.append(f"widget differs: {x} vs {y}")
        elif max(abs(p - q) for p, q in zip(x[3], y[3])) > 0.5:
            errs.append(f"widget rect moved: {x[1]} {x[3]} -> {y[3]}")
    return errs


def fonts_ok(page) -> list[str]:
    used = {s["font"] for b in page.get_text("dict")["blocks"] for l in b.get("lines", []) for s in l["spans"] if s["text"].strip()}
    errs = []
    for xref, ext, ftype, basefont, name, enc, *_ in page.get_fonts(full=True):
        short = basefont.split("+", 1)[-1]
        if ext == "n/a" and (short in used or basefont in used):
            errs.append(f"font not embedded: {basefont}")
    return errs


def bounds_ok(page) -> list[str]:
    r = page.rect + (-0.5, -0.5, 0.5, 0.5)
    bad = []
    for b in page.get_text("rawdict")["blocks"]:
        for l in b.get("lines", []):
            for s in l["spans"]:
                for c in s["chars"]:
                    if c["c"].strip() and not pymupdf.Rect(c["bbox"]) in r:
                        bad.append(c["c"])
    return [f"{len(bad)} glyphs outside page: {''.join(bad)[:30]}"] if bad else []


def trace_signature(page) -> dict:
    sig: dict = {}
    for t in page.get_texttrace():
        look = (t["type"], t["font"], round(t["size"], 2), tuple(round(v, 3) for v in (t["color"] or ())),
                round(t["linewidth"], 2) if t["type"] == 1 else None, round(t["opacity"], 2))
        for c in t["chars"]:
            sig.setdefault((round(c[2][0], 1), round(c[2][1], 1), chr(c[0])), set()).add(look)
    return sig


def appearance_ok(sp, op, redrawn=()) -> list[str]:
    """Original glyphs that survive must be painted exactly as in the source.

    `redrawn` are the boxes of units the build re-drew (from build-info/), whose
    glyphs are new even if they happen to sit where an original glyph was."""
    a, b = trace_signature(sp), trace_signature(op)
    boxes = [pymupdf.Rect(r) + (-0.5, -0.5, 0.5, 0.5) for r in redrawn]

    def same(x, y):
        return (
            x[0] == y[0] and x[1] == y[1] and abs(x[2] - y[2]) < 0.05 and len(x[3]) == len(y[3])
            and all(abs(p - q) < 0.012 for p, q in zip(x[3], y[3]))
            and (x[4] is None) == (y[4] is None) and (x[4] is None or abs(x[4] - y[4]) < 0.02)
            and abs(x[5] - y[5]) < 0.02
        )

    bad = []
    for k, look in b.items():
        if k not in a or k[2].isspace() or {x[1] for x in look} != {x[1] for x in a[k]}:
            continue
        if any(pymupdf.Point(k[0], k[1]) in r for r in boxes):
            continue
        la, lb = sorted(a[k]), sorted(look)
        if len(la) != len(lb) or not all(same(x, y) for x, y in zip(la, lb)):
            bad.append(k[2])
    return [f"p{sp.number + 1}: {len(bad)} untouched glyphs painted differently: {''.join(bad)[:30]!r}"] if bad else []


def squash(s: str) -> str:
    return "".join(s.split())


def check(src: Path, out: Path, trans: dict | None, lang: str, png_dir: Path, dpi: int, slug: str) -> list[str]:
    errs = []
    if not out.exists():
        return ["missing output"]
    sdoc, odoc = pymupdf.open(src), pymupdf.open(out)
    sample = trans is None
    if not sample:
        if sdoc.page_count != odoc.page_count:
            errs.append(f"page count {odoc.page_count} != {sdoc.page_count}")
        for sp, op in zip(sdoc, odoc):
            if abs(sp.rect.width - op.rect.width) > 0.01 or abs(sp.rect.height - op.rect.height) > 0.01:
                errs.append(f"page {sp.number + 1} size differs")
        errs += compare_widgets(widgets(sdoc), widgets(odoc))
        info_path = ROOT / "build-info" / lang / f"{slug}.json"
        redrawn = json.loads(info_path.read_text()).get("redrawn", []) if info_path.exists() else []
        for sp, op in zip(sdoc, odoc):
            boxes = [r[k] for r in redrawn if r["page"] == sp.number + 1 for k in ("old", "new")]
            errs += appearance_ok(sp, op, boxes)
        if acro_count(sdoc) != acro_count(odoc):
            errs.append(f"AcroForm fields {acro_count(odoc)} != {acro_count(sdoc)}")
        # text parity per page
        for page in odoc:
            units = [u for u in trans["units"] if u["page"] == page.number + 1]
            expected = Counter(squash("".join(u[lang] for u in units)))
            got = Counter(squash(page.get_text("text")))
            if expected != got:
                errs.append(
                    f"p{page.number + 1} text mismatch: extra={''.join(sorted((got - expected).elements()))!r} "
                    f"missing={''.join(sorted((expected - got).elements()))!r}"
                )
            text = page.get_text("text")
            words = set(text.split())
            new_words = {w for u in units for w in u[lang].split()}
            for u in units:
                if squash(u[lang]) == squash(u["src"]):
                    continue
                for w in u["src"].split():
                    if len(w) > 3 and w in words and w not in new_words:
                        errs.append(f"p{page.number + 1} leftover source word {w!r} ({u['id']})")
    for page in odoc:
        errs += fonts_ok(page)
        errs += bounds_ok(page)
        name = slug if page.number == 0 else f"{slug}-p{page.number + 1}"
        png_dir.mkdir(parents=True, exist_ok=True)
        page.get_pixmap(dpi=dpi).save(png_dir / f"{name}.png")
    return errs


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--source", type=Path, default=ROOT / "source")
    ap.add_argument("--translations", type=Path, default=ROOT / "translations")
    ap.add_argument("--out", type=Path, default=ROOT / "out")
    ap.add_argument("--png", type=Path, default=ROOT / "png")
    ap.add_argument("--lang", action="append", choices=LANGS)
    ap.add_argument("--slug", action="append")
    ap.add_argument("--dpi", type=int, default=80)
    ap.add_argument("--json", type=Path, default=ROOT / "verify-report.json")
    args = ap.parse_args()
    langs = args.lang or LANGS
    slugs = sorted(p.stem for p in args.source.glob("*.pdf"))
    if args.slug:
        slugs = [s for s in slugs if s in args.slug]
    results: dict = {}
    for slug in slugs:
        tpath = args.translations / f"{slug}.json"
        trans = json.loads(tpath.read_text()) if tpath.exists() else None
        for lang in langs:
            if trans is None:
                errs = ["no translations"]
            else:
                errs = check(args.source / f"{slug}.pdf", args.out / lang / f"{slug}.pdf", trans, lang, args.png / lang, args.dpi, slug)
            results.setdefault(slug, {})[lang] = errs
    # free samples
    sample_src = args.source / "ukentlig-plan.pdf"
    for lang in langs:
        out = args.out / lang / "gratis-ukentlig-plan-smakebit.pdf"
        if out.exists() and (not args.slug or "gratis-ukentlig-plan-smakebit" in args.slug):
            errs = check(sample_src, out, None, lang, args.png / lang, args.dpi, "gratis-ukentlig-plan-smakebit")
            doc, src = pymupdf.open(out), pymupdf.open(sample_src)
            n_src = len(list(src[0].widgets()))
            if doc.page_count != 1:
                errs.append("sample must have 1 page")
            if len(list(doc[0].widgets())) != n_src or acro_count(doc) < n_src:
                errs.append("sample lost form fields")
            results.setdefault("gratis-ukentlig-plan-smakebit", {})[lang] = errs
    # report
    width = max(len(s) for s in results) + 2
    print("file".ljust(width) + "  ".join(l.ljust(4) for l in langs))
    failed = 0
    for slug, row in results.items():
        cells = []
        for lang in langs:
            e = row.get(lang)
            cells.append("-   " if e is None else ("PASS" if not e else "FAIL"))
            failed += bool(e)
        print(slug.ljust(width) + "  ".join(cells))
    for slug, row in results.items():
        for lang, errs in row.items():
            for e in errs:
                print(f"  {lang}/{slug}: {e}")
    args.json.write_text(json.dumps(results, ensure_ascii=False, indent=1) + "\n")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
