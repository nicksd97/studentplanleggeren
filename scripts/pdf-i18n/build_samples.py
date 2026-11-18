#!/usr/bin/env python3
"""Build the translated free samples from the translated Ukentlig Plan.

    python3 build_samples.py [--plans out] [--fonts fonts] [--out out] [--lang de ...]

Same construction as build-lead-magnet.py (page 1 of the weekly plan with its
form fields, a "free sample" badge top right and a dark bottom banner linking
to the shop), but with the badge/banner text translated and the link pointing
to https://www.studentplanlegger.no/<lang>/produkter (same utm parameters).

Input:  out/<lang>/ukentlig-plan.pdf (from translate_planners.py)
Output: out/<lang>/gratis-ukentlig-plan-smakebit.pdf
"""

from __future__ import annotations

import argparse
import io
import sys
from collections import Counter
from pathlib import Path

import pymupdf
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent
LANGS = ["en", "de", "sv", "da", "es", "fr"]
UTM = "utm_source=smakebit&utm_medium=pdf&utm_campaign=gratis-ukeplan"

# Geometry and colours exactly as in build-lead-magnet.py.
DARK = (0x2B / 255, 0x2B / 255, 0x2B / 255)
GREY = (0x41 / 255, 0x40 / 255, 0x42 / 255)
WHITE = (1, 1, 1)
LEFT, RIGHT = 36.0, 559.0
CONTENT_BOTTOM = 806.0

TEXT = {
    "en": {
        "badge": "FREE SAMPLE",
        "sub": "Monday–Wednesday from the Weekly Plan",
        "banner": ("Free sample", " – get the full weekly plan at ", "studentplanlegger.no"),
        "title": "Free sample – Weekly Plan | Studentplanlegger",
        "subject": "Monday–Wednesday from the Weekly Plan. Get the full weekly plan at studentplanlegger.no",
        "keywords": "weekly plan, weekly planner, student planner, free",
        "lang": "en",
    },
    "de": {
        "badge": "KOSTENLOSE PROBE",
        "sub": "Montag–Mittwoch aus dem Wochenplan",
        "banner": ("Kostenlose Probe", " – den kompletten Wochenplan gibt es auf ", "studentplanlegger.no"),
        "title": "Kostenlose Probe – Wochenplan | Studentplanlegger",
        "subject": "Montag–Mittwoch aus dem Wochenplan. Den kompletten Wochenplan gibt es auf studentplanlegger.no",
        "keywords": "Wochenplan, Wochenplaner, Studienplaner, kostenlos",
        "lang": "de-DE",
    },
    "sv": {
        "badge": "GRATIS SMAKPROV",
        "sub": "Måndag–onsdag ur Veckoplan",
        "banner": ("Gratis smakprov", " – hela veckoplanen hittar du på ", "studentplanlegger.no"),
        "title": "Gratis smakprov – Veckoplan | Studentplanlegger",
        "subject": "Måndag–onsdag ur Veckoplan. Hela veckoplanen hittar du på studentplanlegger.no",
        "keywords": "veckoplan, veckoplanering, studentplanerare, gratis",
        "lang": "sv-SE",
    },
    "da": {
        "badge": "GRATIS SMAGSPRØVE",
        "sub": "Mandag–onsdag fra Ugeplan",
        "banner": ("Gratis smagsprøve", " – hele ugeplanen finder du på ", "studentplanlegger.no"),
        "title": "Gratis smagsprøve – Ugeplan | Studentplanlegger",
        "subject": "Mandag–onsdag fra Ugeplan. Hele ugeplanen finder du på studentplanlegger.no",
        "keywords": "ugeplan, ugeplanlægger, studieplanlægger, gratis",
        "lang": "da-DK",
    },
    "es": {
        "badge": "MUESTRA GRATIS",
        "sub": "De lunes a miércoles del Plan Semanal",
        "banner": ("Muestra gratis", " – el plan semanal completo está en ", "studentplanlegger.no"),
        "title": "Muestra gratis – Plan Semanal | Studentplanlegger",
        "subject": "De lunes a miércoles del Plan Semanal. El plan semanal completo está en studentplanlegger.no",
        "keywords": "plan semanal, planificador semanal, agenda de estudiante, gratis",
        "lang": "es-ES",
    },
    "fr": {
        "badge": "EXTRAIT GRATUIT",
        "sub": "Du lundi au mercredi, extrait du Planning hebdomadaire",
        "banner": ("Extrait gratuit", " – le planning hebdomadaire complet sur ", "studentplanlegger.no"),
        "title": "Extrait gratuit – Planning hebdomadaire | Studentplanlegger",
        "subject": "Du lundi au mercredi, extrait du Planning hebdomadaire. Le planning complet sur studentplanlegger.no",
        "keywords": "planning hebdomadaire, agenda étudiant, planner, gratuit",
        "lang": "fr-FR",
    },
}


def fail(message: str) -> None:
    print(f"build_samples: {message}", file=sys.stderr)
    sys.exit(1)


def subset(path: Path, chars: str) -> bytes:
    tt = TTFont(path)
    opts = Options()
    opts.layout_features = []
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = Subsetter(opts)
    sub.populate(text=chars)
    sub.subset(tt)
    buf = io.BytesIO()
    tt.save(buf)
    return buf.getvalue()


def acroform_field_count(doc: pymupdf.Document) -> int:
    kind, value = doc.xref_get_key(doc.pdf_catalog(), "AcroForm/Fields")
    if kind == "xref":
        value = doc.xref_object(int(value.split()[0]))
    elif kind != "array":
        return 0
    return value.count(" R")


def rebuild_acroform(doc: pymupdf.Document, default_resources: str) -> None:
    # Document.select() drops the catalog /AcroForm; the fields are flat (one
    # widget per field), so page 1's widgets are the complete field list.
    fields = " ".join(f"{w.xref} 0 R" for w in doc[0].widgets())
    xref = doc.get_new_xref()
    doc.update_object(xref, f"<< /DR {default_resources} /Fields [ {fields} ] >>")
    doc.xref_set_key(doc.pdf_catalog(), "AcroForm", f"{xref} 0 R")


def build(lang: str, plan: Path, fonts: Path, out: Path) -> None:
    t = TEXT[lang]
    doc = pymupdf.open(plan)
    if doc.page_count != 2:
        fail(f"{plan}: expected the 2-page weekly plan, got {doc.page_count} pages")
    first_text = doc[0].get_text()
    first_page_widgets = len(list(doc[0].widgets()))
    kind, default_resources = doc.xref_get_key(doc.pdf_catalog(), "AcroForm/DR")
    if kind == "null":
        default_resources = "<< >>"

    doc.select([0])
    doc.set_toc([])
    doc.del_xml_metadata()
    page = doc[0]

    bold_file, medium_file = fonts / "Montserrat-SemiBold.ttf", fonts / "Montserrat-Medium.ttf"
    bold_chars = t["badge"] + t["banner"][0] + t["banner"][2]
    medium_chars = t["sub"] + t["banner"][1]
    bold_buf = subset(bold_file, "".join(sorted(set(bold_chars))))
    medium_buf = subset(medium_file, "".join(sorted(set(medium_chars))))
    page.insert_font(fontname="msb", fontbuffer=bold_buf)
    page.insert_font(fontname="msm", fontbuffer=medium_buf)
    bold = pymupdf.Font(fontbuffer=bold_buf)
    medium = pymupdf.Font(fontbuffer=medium_buf)
    for ch in bold_chars:
        if not bold.has_glyph(ord(ch)):
            fail(f"{lang}: {ch!r} missing in Montserrat SemiBold")
    for ch in medium_chars:
        if not medium.has_glyph(ord(ch)):
            fail(f"{lang}: {ch!r} missing in Montserrat Medium")

    # badge (top right)
    size, pad_x = 8.5, 9
    width = bold.text_length(t["badge"], size) + 2 * pad_x
    rect = pymupdf.Rect(RIGHT - width, 29, RIGHT, 46)
    page.draw_rect(rect, color=None, fill=DARK, overlay=True)
    page.insert_text((rect.x0 + pad_x, rect.y1 - 5.6), t["badge"], fontname="msb", fontsize=size, color=WHITE)
    sub_size = 6.6
    page.insert_text(
        (RIGHT - medium.text_length(t["sub"], sub_size), 56.5), t["sub"], fontname="msm", fontsize=sub_size, color=GREY
    )

    # banner (bottom), shrunk if a translation is wider than the bar
    rect = pymupdf.Rect(LEFT, CONTENT_BOTTOM + 7, RIGHT, CONTENT_BOTTOM + 30)
    page.draw_rect(rect, color=None, fill=DARK, overlay=True)
    parts = [("msb", bold, t["banner"][0]), ("msm", medium, t["banner"][1]), ("msb", bold, t["banner"][2])]
    size = 8.8
    total = sum(f.text_length(s, size) for _, f, s in parts)
    if total > rect.width - 24:
        size *= (rect.width - 24) / total
        total = sum(f.text_length(s, size) for _, f, s in parts)
    x = (rect.x0 + rect.x1 - total) / 2
    baseline = rect.y1 - 8.2
    for name, font, text in parts:
        page.insert_text((x, baseline), text, fontname=name, fontsize=size, color=WHITE)
        x += font.text_length(text, size)
    url = f"https://www.studentplanlegger.no/{lang}/produkter?{UTM}"
    page.insert_link({"kind": pymupdf.LINK_URI, "from": rect, "uri": url})

    now = pymupdf.get_pdf_now()
    doc.set_metadata(
        {
            "title": t["title"],
            "author": "Studentplanlegger",
            "subject": t["subject"],
            "keywords": t["keywords"],
            "creator": "build_samples.py",
            "producer": f"PyMuPDF {pymupdf.VersionBind}",
            "creationDate": now,
            "modDate": now,
        }
    )
    doc.xref_set_key(doc.pdf_catalog(), "Lang", f"({t['lang']})")
    rebuild_acroform(doc, default_resources)
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(out, garbage=4, deflate=True, clean=True)
    doc.close()

    # self-check
    result = pymupdf.open(out)
    if result.page_count != 1:
        fail(f"{lang}: output must be exactly 1 page")
    widgets = len(list(result[0].widgets()))
    if widgets != first_page_widgets or acroform_field_count(result) < widgets:
        fail(f"{lang}: form fields lost: {widgets} widgets, expected {first_page_widgets}")
    expected = Counter("".join((first_text + t["badge"] + t["sub"] + "".join(t["banner"])).split()))
    got = Counter("".join(result[0].get_text().split()))
    if expected != got:
        fail(f"{lang}: unexpected text: extra={got - expected} missing={expected - got}")
    links = [l["uri"] for l in result[0].get_links()]
    if links != [url]:
        fail(f"{lang}: link is {links}")
    print(f"Wrote {out.relative_to(ROOT)} (1 page, {widgets} fillable fields, link {url})")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--plans", type=Path, default=ROOT / "out", help="dir with <lang>/ukentlig-plan.pdf")
    ap.add_argument("--fonts", type=Path, default=ROOT / "fonts")
    ap.add_argument("--out", type=Path, default=ROOT / "out")
    ap.add_argument("--lang", action="append", choices=LANGS)
    args = ap.parse_args()
    for lang in args.lang or LANGS:
        build(lang, args.plans / lang / "ukentlig-plan.pdf", args.fonts, args.out / lang / "gratis-ukentlig-plan-smakebit.pdf")


if __name__ == "__main__":
    main()
