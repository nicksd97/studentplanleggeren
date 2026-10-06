#!/usr/bin/env python3
"""Rett skrivefeil i de betalte planleggerne uten å endre layout eller skjemafelt.

Bruk:
    python3 scripts/fix-planner-typos.py [--source assets/source] [--out assets/source/fixed]

Kildefilene ligger git-ignorert i assets/source/. Utdata skrives til
assets/source/fixed/ (også git-ignorert) — betalte PDF-er skal aldri inn i repoet.

Rettelsene gjøres direkte i innholdsstrømmene (samme font, størrelse og farge som
originalteksten). Der den innebygde font-delmengden mangler en bokstav, slettes den
gamle glyfen og den nye tegnes på samme grunnlinje med full versjon av samme font
fra assets/fonts/.
"""

from __future__ import annotations

import argparse
import io
import re
import sys
from pathlib import Path

import pymupdf
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"


def replace(stream: bytes, old: bytes, new: bytes, count: int) -> bytes:
    found = stream.count(old)
    if found != count:
        raise SystemExit(f"forventet {count} treff, fant {found}: {old[:80]!r}")
    return stream.replace(old, new)


def edit_page_stream(doc: pymupdf.Document, page_no: int, edits) -> None:
    xrefs = doc[page_no].get_contents()
    if len(xrefs) != 1:
        raise SystemExit(f"side {page_no + 1}: forventet én innholdsstrøm, fant {len(xrefs)}")
    stream = doc.xref_stream(xrefs[0])
    for old, new, count in edits:
        stream = replace(stream, old, new, count)
    doc.update_stream(xrefs[0], stream)


def font_xref(page: pymupdf.Page, name: str) -> int:
    for f in page.get_fonts():
        if f[4] == name:
            return f[0]
    raise SystemExit(f"fant ikke font {name}")


def simple_widths(doc: pymupdf.Document, xref: int) -> dict[str, int]:
    obj = doc.xref_object(xref)
    first = int(re.search(r"/FirstChar (\d+)", obj).group(1))
    widths = [int(w) for w in re.search(r"/Widths \[([^\]]*)\]", obj).group(1).split()]
    return {chr(first + i): w for i, w in enumerate(widths)}


def cid_widths(doc: pymupdf.Document, xref: int) -> dict[int, float]:
    descendant = int(re.search(r"/DescendantFonts \[?\s*(\d+)", doc.xref_object(xref)).group(1))
    obj = doc.xref_object(descendant)
    if obj.strip().startswith("["):
        obj = doc.xref_object(int(re.search(r"(\d+) 0 R", obj).group(1)))
    w_ref = re.search(r"/W (\d+) 0 R", obj)
    raw = doc.xref_object(int(w_ref.group(1))) if w_ref else re.search(r"/W \[(.*?)\]\s*(?:/|>>)", obj, re.S).group(1)
    tokens = re.findall(r"\[|\]|-?\d+(?:\.\d+)?", raw.strip().strip("[]") if w_ref else raw)
    widths: dict[int, float] = {}
    i = 0
    while i < len(tokens):
        start = int(tokens[i])
        if tokens[i + 1] == "[":
            i += 2
            cid = start
            while tokens[i] != "]":
                widths[cid] = float(tokens[i])
                cid += 1
                i += 1
            i += 1
        else:
            end, w = int(tokens[i + 1]), float(tokens[i + 2])
            for cid in range(start, end + 1):
                widths[cid] = w
            i += 3
    return widths


def find_chars(page: pymupdf.Page, text: str, near: tuple[float, float] | None = None):
    """Finn første tekstspor som inneholder `text` og returner tegnene (med spor-info)."""
    for trace in page.get_texttrace():
        s = "".join(chr(c[0]) for c in trace["chars"])
        i = s.find(text)
        if i < 0:
            continue
        chars = trace["chars"][i : i + len(text)]
        if near and (abs(chars[0][2][0] - near[0]) > 3 or abs(chars[0][2][1] - near[1]) > 3):
            continue
        return trace, chars
    raise SystemExit(f"fant ikke teksten {text!r}")


def subset_font(fontfile: Path, chars: str) -> bytes:
    # Bare de nye glyfene bygges inn; pymupdf sin subset_fonts() ville også ha
    # kuttet i fontene skjemafeltene bruker.
    font = TTFont(fontfile)
    subsetter = Subsetter(Options())
    subsetter.populate(text=chars)
    subsetter.subset(font)
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def overlay_glyph(page, fontname, fontbuffer, char, centre_x, baseline_y, size, colour):
    font = pymupdf.Font(fontbuffer=fontbuffer)
    x = centre_x - font.text_length(char, fontsize=size) / 2
    page.insert_font(fontname=fontname, fontbuffer=fontbuffer)
    page.insert_text((x, baseline_y), char, fontname=fontname, fontsize=size, color=colour)


def char_centre(char) -> float:
    bbox = char[3]
    return (bbox[0] + bbox[2]) / 2


def fmt(x: float) -> bytes:
    return f"{x:.4f}".rstrip("0").rstrip(".").encode()


# --- ukentlig-plan -----------------------------------------------------------


def fix_ukentlig_plan(doc: pymupdf.Document) -> list[str]:
    # Side 1: andre «12:00» i hver dagskolonne skal være «12:30» (glyf 05C3 = «3»).
    edit_page_stream(
        doc,
        0,
        [
            (
                f"{pos} Td\n<05C105C2062805C005C0>Tj".encode(),
                f"{pos} Td\n<05C105C2062805C305C0>Tj".encode(),
                1,
            )
            for pos in ("164.382 450.215", "297.639 450.199", "431.143 450.182")
        ],
    )

    # Side 2: «TORDAG» -> «TORSDAG». C2_1-delmengden mangler «S», så den tegnes med
    # TT0 (samme Raleway-Regular, 6,6 pt). Ordet flyttes halve S-bredden til venstre
    # for å holde det sentrert.
    page = doc[1]
    w_s = simple_widths(doc, font_xref(page, "TT0"))["S"]
    tc = 0.858
    shift = (w_s * 6.6 / 1000 + tc) / 2
    edit_page_stream(
        doc,
        1,
        [
            (
                b"0.858 Tc -0.858 Tw 81.363 753.92 Td\n<0036>Tj\n1 0 0 1 86.2472 753.9198 Tm\n"
                b"<0032003500270024002A>Tj",
                b"0.858 Tc -0.858 Tw " + fmt(81.363 - shift) + b" 753.92 Td\n<0036>Tj\n1 0 0 1 "
                + fmt(86.2472 - shift)
                + b" 753.9198 Tm\n<00320035>Tj\n/TT0 6.6 Tf\n(S)Tj\n/C2_1 6.6 Tf\n<00270024002A>Tj",
                1,
            ),
            # «16::00» -> «16:00» (fjern ett kolon, glyf 0628).
            (
                b"<05C1>Tj\n/C0_2 5.6 Tf\n<05C60628062805C005C0>Tj",
                b"<05C1>Tj\n/C0_2 5.6 Tf\n<05C6062805C005C0>Tj",
                1,
            ),
            (b"<05C105C60628062805C005C0>Tj", b"<05C105C6062805C005C0>Tj", 3),
            # «22::30» -> «22:30».
            (b"<05C205C20628062805C305C0>Tj", b"<05C205C2062805C305C0>Tj", 4),
            # C0_7 er ikke innebygd og vises med feil (fet) reservefont i kolonne 2–4.
            # C0_5 er samme Montserrat-Light, innebygd med alle sifre og kolon.
            (b"/C0_7 5.6 Tf", b"/C0_5 5.6 Tf", 15),
        ],
    )
    return [
        "Side 1: andre «12:00» -> «12:30» i alle tre dagskolonnene (mandag–onsdag)",
        "Side 2: «TORDAG» -> «TORSDAG»",
        "Side 2: «16::00» -> «16:00» (4 kolonner) og «22::30» -> «22:30» (4 kolonner)",
        "Side 2: klokkeslett i kolonne 2–4 brukte en ikke-innebygd font som ble vist fet; "
        "byttet til den innebygde Montserrat Light som resten av planen bruker",
    ]


# --- 30-dagers-utfordring ----------------------------------------------------


def fix_30_dagers(doc: pymupdf.Document) -> list[str]:
    # Nederste rad (to bokser, leses venstre -> høyre etter slangemønsteret) var
    # merket «30», «31»; skal være «29», «30». Strengene er i Montserrat-Regular
    # (TT2) med Tm 18,3. I TJ-arrayen tegnes «31» (høyre boks) først, og +4329
    # flytter tilbake til venstre boks for «30».
    page = doc[0]
    widths = simple_widths(doc, font_xref(page, "TT2"))
    w31 = widths["3"] + widths["1"]
    w30 = widths["3"] + widths["0"]
    w29 = widths["2"] + widths["9"]
    # Ny: «30» sentrert der «31» sto, «29» sentrert der «30» sto (tusendeler av tekstrom).
    old_30_centre = w31 - 4329 + w30 / 2
    new_30_start = (w31 - w30) / 2
    new_29_start = old_30_centre - w29 / 2
    kern = -(new_29_start - (new_30_start + w30))
    dx = new_30_start / 1000
    edit_page_stream(
        doc,
        0,
        [
            (
                b"[(31)4329 (30)]TJ",
                fmt(dx) + b" 0 Td\n[(30)" + fmt(kern) + b" (29)]TJ\n" + fmt(-dx) + b" 0 Td",
                1,
            )
        ],
    )
    return ["Boksene var nummerert 1–28, 30, 31 (29 manglet); nederste rad er nå «29», «30» så planen går 1–30"]


# --- ukentlig-gjoremaal ------------------------------------------------------


def fix_ukentlig_gjoremaal(doc: pymupdf.Document) -> list[str]:
    page = doc[0]
    trace, chars = find_chars(page, "TIRDAG")
    widths = cid_widths(doc, font_xref(page, "C0_2"))
    size = trace["size"]
    # Tegnavstand (Tc) utledet fra avstanden mellom «T» og «I».
    tc = chars[1][2][0] - chars[0][2][0] - widths[chars[0][1]] * size / 1000
    gid_s = 175
    if gid_s not in widths:
        raise SystemExit("C0_2 mangler «S»")
    a = widths[gid_s] * size / 1000 + tc
    edit_page_stream(
        doc,
        0,
        [
            (
                b"268.834 669.661 Td\n<00BD005500A7>Tj\n1 0 0 1 295.3796 669.661 Tm\n<00250001>Tj\n"
                b"1 0 0 1 319.2336 669.661 Tm\n<0047>Tj",
                fmt(268.834 - a / 2) + b" 669.661 Td\n<00BD005500A700AF>Tj\n1 0 0 1 "
                + fmt(295.3796 + a / 2) + b" 669.661 Tm\n<00250001>Tj\n1 0 0 1 "
                + fmt(319.2336 + a / 2) + b" 669.661 Tm\n<0047>Tj",
                1,
            )
        ],
    )
    return ["«TIRDAG» -> «TIRSDAG»"]


# --- vane-tracker ------------------------------------------------------------


def fix_vane_tracker(doc: pymupdf.Document) -> list[str]:
    # Ukedagsforbokstavene var engelske (M T W T F S S). Bytt til norsk M T O T F L S.
    page = doc[0]
    widths = simple_widths(doc, font_xref(page, "TT2"))
    targets = []
    for trace in page.get_texttrace():
        chars = trace["chars"]
        for i in range(0, len(chars) - 6):
            if "".join(chr(c[0]) for c in chars[i : i + 7]) == "MTWTFSS":
                targets.append((chars[i + 2], chars[i + 5], trace["size"], trace["color"]))
    if len(targets) != 5:
        raise SystemExit(f"vane-tracker: forventet 5 ukerader, fant {len(targets)}")

    xref = page.get_contents()[0]
    stream = doc.xref_stream(xref)
    pattern = re.compile(rb"\[\(M\)(-?\d+) \(T\)(-?\d+) \(W\)(-?\d+) \(T\)(-?\d+) \(F\)(-?\d+) \(S\)(-?\d+) \(S\)\]TJ")

    def repl(m: re.Match) -> bytes:
        n = [int(g) for g in m.groups()]
        return (
            f"[(M){n[0]} (T){n[1]} {n[2] - widths['W']} (T){n[3]} (F){n[4]} {n[5] - widths['S']} (S)]TJ"
        ).encode()

    stream, hits = pattern.subn(repl, stream)
    if hits != 5:
        raise SystemExit(f"vane-tracker: forventet 5 TJ-treff, fant {hits}")
    doc.update_stream(xref, stream)

    font = subset_font(FONTS / "Montserrat-Regular.ttf", "OL")
    for w_char, s_char, size, colour in targets:
        rgb = tuple(colour) if colour else (0, 0, 0)
        overlay_glyph(page, "MontReg", font, "O", char_centre(w_char), w_char[2][1], size, rgb)
        overlay_glyph(page, "MontReg", font, "L", char_centre(s_char), s_char[2][1], size, rgb)
    return ["Ukedagsforbokstavene «M T W T F S S» (engelsk) -> «M T O T F L S» i alle fem ukeradene"]


# --- ukentlig-matplan --------------------------------------------------------


def fix_ukentlig_matplan(doc: pymupdf.Document) -> list[str]:
    page = doc[0]
    trace, chars = find_chars(page, "S", near=(38.8301, page.rect.height - 187.0412))
    s_char = chars[0]
    colour = tuple(trace["color"]) if trace["color"] else (0, 0, 0)
    edit_page_stream(
        doc,
        0,
        [
            # Lørdagens måltider «F L D K» -> «F L M K» (frokost, lunsj, middag, kvelds).
            (b"7.1 0 0 7.1 58.3646 175.5347 Tm\n( D)Tj", b"7.1 0 0 7.1 58.3646 175.5347 Tm\n( M)Tj", 1),
            # Lørdag var merket «S»; fjern glyfen og tegn «L» i samme Josefin Sans Medium.
            (b"13 0 0 13 38.8301 187.0412 Tm\n(S)Tj", b"13 0 0 13 38.8301 187.0412 Tm", 1),
        ],
    )
    overlay_glyph(
        page, "JosMed", subset_font(FONTS / "JosefinSans-Medium.ttf", "L"), "L",
        char_centre(s_char), s_char[2][1], trace["size"], colour,
    )
    return [
        "Lørdag var merket «S» (skulle vært «L»)",
        "Måltidsforkortelsene på lørdag var «F L D K»; nå «F L M K» som de andre dagene",
    ]


# --- «Dagelig» -> «Daglig» i titlene ----------------------------------------


def e_advance(page: pymupdf.Page, word: str) -> float:
    """Avstand fra «E» til neste bokstav i tittelen (bredde + tegnavstand)."""
    _, chars = find_chars(page, word)
    i = word.upper().index("GE") + 1
    return chars[i + 1][2][0] - chars[i][2][0]


def fix_daglig_gjennomgang(doc: pymupdf.Document) -> list[str]:
    shift = e_advance(doc[0], "DAGELIG")
    edit_page_stream(
        doc,
        0,
        [
            (b"<002500010047002D006A00550047>Tj", b"<002500010047006A00550047>Tj", 1),
            # Siste «NG» i «GJENNOMGANG» er plassert absolutt og må flyttes like langt.
            (b"1 0 0 1 371.939 785.6581 Tm\n<00760047>Tj", b"1 0 0 1 " + fmt(371.939 - shift) + b" 785.6581 Tm\n<00760047>Tj", 1),
        ],
    )
    return ["Tittelen «DAGELIG GJENNOMGANG» -> «DAGLIG GJENNOMGANG»"]


def fix_daglig_helseplan(doc: pymupdf.Document) -> list[str]:
    edit_page_stream(doc, 0, [(b"<002500010047002D006A00550047>Tj", b"<002500010047006A00550047>Tj", 1)])
    return ["Tittelen «DAGELIG PLAN» -> «DAGLIG PLAN»"]


def fix_daglig_planlegger(doc: pymupdf.Document) -> list[str]:
    edit_page_stream(
        doc,
        0,
        [
            (b"<002600CE010C00F6012B0115010C0003", b"<002600CE010C012B0115010C0003", 1),
            # «VANN INTAK» -> «VANNINNTAK»: mellomrommet ut, en «N» inn (begge glyfene finnes i C0_6).
            (b"<0076007606760055007600BD00010067>Tj", b"<0076007600550076007600BD00010067>Tj", 1),
        ],
    )
    return ["Tittelen «Dagelig Planlegger» -> «Daglig Planlegger»", "«VANN INTAK» -> «VANNINNTAK»"]


FIXES = {
    "daglig-gjennomgang": fix_daglig_gjennomgang,
    "daglig-helseplan": fix_daglig_helseplan,
    "daglig-planlegger": fix_daglig_planlegger,
    "ukentlig-plan": fix_ukentlig_plan,
    "30-dagers-utfordring": fix_30_dagers,
    "ukentlig-gjoremaal": fix_ukentlig_gjoremaal,
    "vane-tracker": fix_vane_tracker,
    "ukentlig-matplan": fix_ukentlig_matplan,
}


def widget_summary(doc: pymupdf.Document) -> list[tuple]:
    return [(p.number, w.field_name, w.field_type) for p in doc for w in p.widgets()]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--source", type=Path, default=ROOT / "assets" / "source")
    parser.add_argument("--out", type=Path, default=ROOT / "assets" / "source" / "fixed")
    parser.add_argument("only", nargs="*", help="bare disse slugene")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    for slug, fix in FIXES.items():
        if args.only and slug not in args.only:
            continue
        doc = pymupdf.open(args.source / f"{slug}.pdf")
        before = widget_summary(doc)
        changes = fix(doc)
        out = args.out / f"{slug}.pdf"
        doc.save(out, garbage=3, deflate=True)
        check = pymupdf.open(out)
        if widget_summary(check) != before or check.is_form_pdf != doc.is_form_pdf:
            raise SystemExit(f"{slug}: skjemafeltene ble endret")
        print(f"{slug}.pdf ({len(before)} felt beholdt)")
        for c in changes:
            print(f"  - {c}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
