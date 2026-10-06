#!/usr/bin/env python3
"""Build the free /gratis sample from the real Ukentlig Plan PDF.

The sample is page 1 of the paid `ukentlig-plan.pdf` (Mandag–onsdag, with
Mål, Prioriteringer, Gjøremål, Vaner and Notater) unchanged, with its form
fields kept, plus a "Gratis smakebit" badge and a bottom banner. Page 2
(torsdag–søndag) is dropped.

The paid source PDF is never committed (the repo is public). Put it in the
git-ignored assets/source/ folder, or pass any path:

    pip install pymupdf fonttools
    python3 scripts/build-lead-magnet.py assets/source/ukentlig-plan.pdf

Output: assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf
Upload it to Supabase bucket `products` at `leads/gratis-ukentlig-plan-smakebit.pdf`.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "assets" / "lead-magnet" / "fonts"
DEFAULT_OUT = ROOT / "assets" / "lead-magnet" / "gratis-ukentlig-plan-smakebit.pdf"

SHOP_URL = (
    "https://www.studentplanlegger.no/produkter"
    "?utm_source=smakebit&utm_medium=pdf&utm_campaign=gratis-ukeplan"
)

# Colours and margins taken from ukentlig-plan.pdf page 1 (title #2b2b2b,
# labels #414042, content box x 36–559 pt, content ends at y 806 pt).
DARK = (0x2B / 255, 0x2B / 255, 0x2B / 255)
GREY = (0x41 / 255, 0x40 / 255, 0x42 / 255)
WHITE = (1, 1, 1)
LEFT, RIGHT = 36.0, 559.0
CONTENT_BOTTOM = 806.0

FIRST_PAGE_DAYS = ("MANDAG", "TIRSDAG", "ONSDAG")
SECOND_PAGE_DAYS = ("FREDAG", "LØRDAG", "SØNDAG")


def fail(message: str) -> None:
    print(f"build-lead-magnet: {message}", file=sys.stderr)
    sys.exit(1)


def check_source(doc: pymupdf.Document) -> None:
    if doc.page_count != 2:
        fail(f"expected the 2-page ukentlig-plan.pdf, got {doc.page_count} pages")
    first, second = doc[0].get_text(), doc[1].get_text()
    if "UKENTLIG" not in first or not all(day in first for day in FIRST_PAGE_DAYS):
        fail("page 1 is not the Ukentlig Plan mandag–onsdag page")
    if not all(day in second for day in SECOND_PAGE_DAYS):
        fail("page 2 is not the Ukentlig Plan torsdag–søndag page")


def acroform_field_count(doc: pymupdf.Document) -> int:
    kind, value = doc.xref_get_key(doc.pdf_catalog(), "AcroForm/Fields")
    if kind == "xref":
        value = doc.xref_object(int(value.split()[0]))
    elif kind != "array":
        return 0
    return value.count(" R")


def rebuild_acroform(doc: pymupdf.Document, default_resources: str) -> None:
    # Document.select() drops the catalog /AcroForm, which makes Acrobat
    # treat the remaining widgets as non-fillable. The source fields are flat
    # (one widget per field), so page 1's widgets are the complete field list.
    fields = " ".join(f"{w.xref} 0 R" for w in doc[0].widgets())
    xref = doc.get_new_xref()
    doc.update_object(xref, f"<< /DR {default_resources} /Fields [ {fields} ] >>")
    doc.xref_set_key(doc.pdf_catalog(), "AcroForm", f"{xref} 0 R")


def draw_badge(page: pymupdf.Page, bold: pymupdf.Font, medium: pymupdf.Font) -> None:
    label = "GRATIS SMAKEBIT"
    size = 8.5
    pad_x = 9
    width = bold.text_length(label, size) + 2 * pad_x
    rect = pymupdf.Rect(RIGHT - width, 29, RIGHT, 46)
    page.draw_rect(rect, color=None, fill=DARK, overlay=True)
    page.insert_text(
        (rect.x0 + pad_x, rect.y1 - 5.6), label, fontname="msb", fontsize=size, color=WHITE
    )

    sub = "Mandag–onsdag fra Ukentlig Plan"
    sub_size = 6.6
    page.insert_text(
        (RIGHT - medium.text_length(sub, sub_size), 56.5),
        sub,
        fontname="msm",
        fontsize=sub_size,
        color=GREY,
    )


def draw_banner(page: pymupdf.Page, bold: pymupdf.Font, medium: pymupdf.Font) -> None:
    rect = pymupdf.Rect(LEFT, CONTENT_BOTTOM + 7, RIGHT, CONTENT_BOTTOM + 30)
    page.draw_rect(rect, color=None, fill=DARK, overlay=True)

    size = 8.8
    parts = [
        ("msb", bold, "Gratis smakebit"),
        ("msm", medium, " – hele ukeplanen finner du på "),
        ("msb", bold, "studentplanlegger.no"),
    ]
    total = sum(font.text_length(text, size) for _, font, text in parts)
    x = (rect.x0 + rect.x1 - total) / 2
    baseline = rect.y1 - 8.2
    for name, font, text in parts:
        page.insert_text((x, baseline), text, fontname=name, fontsize=size, color=WHITE)
        x += font.text_length(text, size)

    page.insert_link({"kind": pymupdf.LINK_URI, "from": rect, "uri": SHOP_URL})


def build(source: Path, out: Path) -> None:
    doc = pymupdf.open(source)
    check_source(doc)
    first_page_widgets = len(list(doc[0].widgets()))
    kind, default_resources = doc.xref_get_key(doc.pdf_catalog(), "AcroForm/DR")
    if kind == "null":
        default_resources = "<< >>"

    doc.select([0])
    doc.set_toc([])
    doc.del_xml_metadata()

    page = doc[0]
    bold_file = FONT_DIR / "Montserrat-SemiBold.ttf"
    medium_file = FONT_DIR / "Montserrat-Medium.ttf"
    page.insert_font(fontname="msb", fontfile=str(bold_file))
    page.insert_font(fontname="msm", fontfile=str(medium_file))
    bold = pymupdf.Font(fontfile=str(bold_file))
    medium = pymupdf.Font(fontfile=str(medium_file))

    draw_badge(page, bold, medium)
    draw_banner(page, bold, medium)

    now = pymupdf.get_pdf_now()
    doc.set_metadata(
        {
            "title": "Gratis smakebit – Ukentlig Plan | Studentplanlegger",
            "author": "Studentplanlegger",
            "subject": "Mandag–onsdag fra Ukentlig Plan. Hele ukeplanen finner du på studentplanlegger.no",
            "keywords": "ukeplan, ukentlig plan, studentplanlegger, gratis",
            "creator": "scripts/build-lead-magnet.py",
            "producer": f"PyMuPDF {pymupdf.VersionBind}",
            "creationDate": now,
            "modDate": now,
        }
    )
    doc.xref_set_key(doc.pdf_catalog(), "Lang", "(nb-NO)")
    doc.subset_fonts()
    rebuild_acroform(doc, default_resources)

    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(out, garbage=4, deflate=True, clean=True)
    doc.close()

    result = pymupdf.open(out)
    text = result[0].get_text()
    if result.page_count != 1:
        fail("output must be exactly 1 page")
    if any(day in text for day in SECOND_PAGE_DAYS):
        fail("output still contains torsdag–søndag")
    widgets = len(list(result[0].widgets()))
    if widgets != first_page_widgets or acroform_field_count(result) < widgets:
        fail(f"form fields lost: {widgets} widgets, expected {first_page_widgets}")
    print(f"Wrote {out.relative_to(ROOT)} (1 page, {widgets} fillable fields)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("source", type=Path, help="path to the paid ukentlig-plan.pdf")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    build(args.source.resolve(), args.out.resolve())


if __name__ == "__main__":
    main()
