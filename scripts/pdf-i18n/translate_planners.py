#!/usr/bin/env python3
"""Translate the Norwegian study-planner PDFs into en/de/sv/da/es/fr.

    python3 translate_planners.py [--source source] [--translations translations]
                                  [--fonts fonts] [--out out]
                                  [--lang de --lang fr] [--slug ukentlig-plan]
    python3 translate_planners.py --extract [--slug ...]   # (re)write JSON skeletons

How it works
------------
* Text in the source page is grouped into *units* (one translatable label each):
  spans on the same baseline that are word fragments in different fonts
  ("Dat"+"o"+":"), letter-spaced single glyphs ("D A G E L I G") or same-style
  pieces separated by a small gap are merged; spans containing 3+ spaces or
  spaced weekday initials ("M T O T") are split.
* Units on one baseline that sit next to each other (a title in two weights,
  "UKENTLIG " + "PLAN") form a *chain* that is laid out as one line.
* translations/<slug>.json holds every unit (id, page, source text, alignment,
  optional layout overrides) with its six translations.  Units whose
  translation is identical to the source (times, numbers) are left untouched in
  the content stream.
* For every changed unit the original glyphs are removed with a narrow
  redaction band (text only; vector art, images and widgets are untouched),
  then the translation is drawn into a new content stream at the same baseline
  with the same font family/weight (OFL substitutes for Myriad/Garamond/Minion/
  Gill Sans), size, colour, letter spacing and GPOS kerning.  Alignment
  (left/centre/right) is kept; if the text is wider than the space available
  (until the next line, box edge, widget or label) the font size is reduced.
* Fonts are subset with fontTools to exactly the glyphs used in that file.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import statistics
import sys
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

import pymupdf
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent
LANGS = ["en", "de", "sv", "da", "es", "fr"]
MIN_SCALE = 0.70

# Source font (as reported by PyMuPDF, subset tag stripped) -> OFL font file.
FONT_MAP = {
    "Montserrat-Light": "Montserrat-Light.ttf",
    "Montserrat-Regular": "Montserrat-Regular.ttf",
    "Montserrat-Medium": "Montserrat-Medium.ttf",
    "Montserrat-SemiBold": "Montserrat-SemiBold.ttf",
    "Montserrat-Bold": "Montserrat-Bold.ttf",
    "Montserrat-SemiBoldItali": "Montserrat-SemiBoldItalic.ttf",
    "Montserrat-SemiBoldItalic": "Montserrat-SemiBoldItalic.ttf",
    "JosefinSans-Thin": "JosefinSans-Thin.ttf",
    "JosefinSans-ExtraLight": "JosefinSans-ExtraLight.ttf",
    "JosefinSans-Light": "JosefinSans-Light.ttf",
    "JosefinSans-Regular": "JosefinSans-Regular.ttf",
    "JosefinSans-Medium": "JosefinSans-Medium.ttf",
    "Raleway-Light": "Raleway-Light.ttf",
    "Raleway-Regular": "Raleway-Regular.ttf",
    "Raleway-Medium": "Raleway-Medium.ttf",
    "Exo-Light": "Exo-Light.ttf",
    "Exo-Regular": "Exo-Regular.ttf",
    "Quicksand-Regular": "Quicksand-Regular.ttf",
    "Poppins-Regular": "Poppins-Regular.ttf",
    # Non-free originals -> visually close OFL fonts.
    "MyriadPro-Regular": "SourceSans3-Regular.ttf",
    "GaramondPremrPro": "EBGaramond-Regular.ttf",
    "MinionPro-Regular": "CrimsonPro-Regular.ttf",
    "GillSansMT": "Cabin-Regular.ttf",
}

SPACED_LETTERS = re.compile(r"^\s*(?:\S\s+)+\S\s*$")


# --------------------------------------------------------------------------
# Extraction
# --------------------------------------------------------------------------


@dataclass
class Char:
    c: str
    x: float  # origin x
    y: float  # baseline
    adv: float  # advance in pt (bbox width)
    bbox: tuple


@dataclass
class Part:
    chars: list
    font: str
    size: float
    color: int
    rotated: bool = False
    stroke: tuple | None = None  # (line width, (r, g, b)) for faux-bold text (render mode 2)

    @property
    def text(self) -> str:
        return "".join(ch.c for ch in self.chars)

    @property
    def ink(self) -> list:
        return [ch for ch in self.chars if not ch.c.isspace()]

    @property
    def x0(self) -> float:
        return self.ink[0].x

    @property
    def x1(self) -> float:
        last = self.ink[-1]
        return last.x + last.adv

    @property
    def y(self) -> float:
        return statistics.median(ch.y for ch in self.ink)

    def style(self):
        return (self.font, round(self.size, 1), self.color)


@dataclass
class Unit:
    page: int
    parts: list
    text: str = ""
    uid: str = ""
    chain: str | None = None
    align: str = "left"

    @property
    def main(self) -> Part:
        return max(self.parts, key=lambda p: len(p.ink))

    @property
    def x0(self):
        return self.parts[0].x0

    @property
    def x1(self):
        return self.parts[-1].x1

    @property
    def y(self):
        return self.main.y

    @property
    def size(self):
        return self.main.size

    def tracking_em(self) -> float:
        chars = [ch for p in self.parts for ch in p.chars]
        single = all(len(p.ink) == 1 for p in self.parts)
        diffs = []
        for p in self.parts if not single else [Part(chars, "", 0, 0)]:
            cs = p.chars
            for a, b in zip(cs, cs[1:]):
                if a.c.isspace() or b.c.isspace():
                    continue
                diffs.append(b.x - a.x - a.adv)
        if not diffs:
            return 0.0
        trk = statistics.median(diffs) / self.size
        return 0.0 if abs(trk) < 0.03 else trk


def clean_font(name: str) -> str:
    return name.split("+", 1)[-1]


def char_key(x: float, y: float, c: str):
    return (round(x, 1), round(y, 1), c)


def trace_signature(page: pymupdf.Page) -> dict:
    """char position -> how it is painted (font, size, colour, fill/stroke, line width)."""
    sig: dict = {}
    for t in page.get_texttrace():
        look = (
            t["type"],
            t["font"],
            round(t["size"], 2),
            tuple(round(v, 3) for v in (t["color"] or ())),
            round(t["linewidth"], 2) if t["type"] == 1 else None,
            round(t["opacity"], 2),
        )
        for c in t["chars"]:
            sig.setdefault(char_key(c[2][0], c[2][1], chr(c[0])), set()).add(look)
    return sig


def stroke_map(page: pymupdf.Page) -> dict:
    out = {}
    for t in page.get_texttrace():
        if t["type"] == 1:
            for c in t["chars"]:
                out[char_key(c[2][0], c[2][1], chr(c[0]))] = (t["linewidth"], tuple(t["color"] or (0, 0, 0)))
    return out


def page_parts(page: pymupdf.Page) -> list[Part]:
    parts = []
    strokes = stroke_map(page)
    raw = page.get_text("rawdict", flags=pymupdf.TEXTFLAGS_RAWDICT & ~pymupdf.TEXT_PRESERVE_IMAGES)
    for block in raw["blocks"]:
        for line in block.get("lines", []):
            rotated = abs(line["dir"][1]) > 1e-3
            for span in line["spans"]:
                chars = [
                    Char(c["c"], c["origin"][0], c["origin"][1], c["bbox"][2] - c["bbox"][0], tuple(c["bbox"]))
                    for c in span["chars"]
                ]
                text = "".join(c.c for c in chars)
                if not text.strip():
                    continue
                font, size, color = clean_font(span["font"]), span["size"], span["color"]
                pieces = []
                if rotated:  # only numbers/percentages are rotated; never translated
                    parts.append(Part(chars, font, size, color, rotated=True))
                    continue
                if SPACED_LETTERS.match(text) and len(text.strip()) > 1:
                    pieces = [[c] for c in chars if not c.c.isspace()]
                else:
                    # split at runs of >= 3 spaces
                    cur, spaces = [], 0
                    for c in chars:
                        if c.c.isspace():
                            spaces += 1
                        else:
                            if spaces >= 3 and any(not x.c.isspace() for x in cur):
                                pieces.append(cur)
                                cur = []
                            spaces = 0
                        cur.append(c)
                    pieces.append(cur)
                for pc in pieces:
                    # trim whitespace chars at both ends
                    while pc and pc[0].c.isspace():
                        pc = pc[1:]
                    while pc and pc[-1].c.isspace():
                        pc = pc[:-1]
                    if pc:
                        ink = [c for c in pc if not c.c.isspace()]
                        st = strokes.get(char_key(ink[0].x, ink[0].y, ink[0].c))
                        parts.append(Part(pc, font, size, color, stroke=st))
    return parts


def group_lines(parts: list[Part]) -> list[list[Part]]:
    parts = sorted(parts, key=lambda p: (p.y, p.x0))
    lines: list[list[Part]] = []
    for p in parts:
        for ln in lines:
            ref = ln[0]
            if abs(ref.y - p.y) < 0.6 and abs(ref.size - p.size) < 0.5 * max(ref.size, p.size) + 0.01:
                ln.append(p)
                break
        else:
            lines.append([p])
    for ln in lines:
        ln.sort(key=lambda p: p.x0)
    lines.sort(key=lambda ln: (round(ln[0].y, 1), ln[0].x0))
    return lines


def extract_units(page: pymupdf.Page) -> list[Unit]:
    units: list[Unit] = []
    chains = 0
    allparts = page_parts(page)
    for ln in group_lines([p for p in allparts if not p.rotated]):
        line_units: list[Unit] = []
        for p in ln:
            if line_units:
                u = line_units[-1]
                a = u.parts[-1]
                gap = p.x0 - a.x1
                size = max(a.size, p.size)
                same = a.style() == p.style()
                single = len(a.ink) == 1 and len(p.ink) == 1
                frag = (not same) and gap < 0.15 * size and abs(a.y - p.y) < 0.3
                letterspaced = same and single and gap < 0.5 * size and all(len(q.ink) == 1 for q in u.parts)
                joined = same and not single and gap < 0.5 * size and gap > -0.5
                if frag or letterspaced or joined:
                    if joined and gap > 0.2 * size:
                        u.text += " "
                    u.parts.append(p)
                    u.text += p.text
                    continue
            line_units.append(Unit(page.number, [p], p.text))
        # chains: neighbouring units that read as one line (title in two weights)
        for a, b in zip(line_units, line_units[1:]):
            gap = b.x0 - a.x1
            size = max(a.size, b.size)
            if len(a.text) == 1 and len(b.text) == 1:
                continue
            punct = not any(ch.isalnum() for ch in b.text)
            if -0.5 < gap < 0.75 * size and len(a.text) > 2 and (len(b.text) > 2 or punct):
                if a.chain is None:
                    chains += 1
                    a.chain = f"c{page.number + 1}-{chains}"
                b.chain = a.chain
        units.extend(line_units)
    units.extend(Unit(page.number, [p], p.text, align="rotated") for p in allparts if p.rotated)
    for i, u in enumerate(units):
        u.uid = f"p{u.page + 1}-{i + 1:03d}"
    geo = Geometry(page, units)
    for u in units:
        if u.align != "rotated":
            u.align = geo.infer_align(u)
    return units


# --------------------------------------------------------------------------
# Geometry: containers, obstacles, alignment
# --------------------------------------------------------------------------


class Geometry:
    def __init__(self, page: pymupdf.Page, units: list[Unit]):
        self.page = page
        self.units = units
        self.prims: list[tuple[pymupdf.Rect, str]] = []
        for d in page.get_drawings():
            if d["type"] == "f" and d.get("fill") and min(d["fill"]) > 0.98:
                continue  # white masks are invisible: neither containers nor obstacles
            for item in d["items"]:
                kind = item[0]
                if kind == "l":
                    r = pymupdf.Rect(item[1], item[2]).normalize()
                elif kind == "re":
                    r = pymupdf.Rect(item[1]).normalize()
                elif kind == "qu":
                    r = item[1].rect
                elif kind == "c":
                    r = pymupdf.Rect(item[1], item[1])
                    for pt in item[2:]:
                        r |= pt
                else:
                    continue
                if d.get("width") and kind in ("l", "c"):
                    pass
                self.prims.append((r, "rect" if kind in ("re", "qu") else "line"))
        self.widgets = [pymupdf.Rect(w.rect) for w in page.widgets()]

    def group(self, u: Unit) -> list[Unit]:
        if u.chain is None:
            return [u]
        return [v for v in self.units if v.chain == u.chain]

    def box(self, grp: list[Unit]) -> tuple[float, float, float, float]:
        x0 = min(v.x0 for v in grp)
        x1 = max(v.x1 for v in grp)
        y = grp[0].y
        size = max(v.size for v in grp)
        return x0, x1, y, size

    def container(self, grp):
        x0, x1, y, size = self.box(grp)
        top = y - 0.75 * size
        best = None
        for r, kind in self.prims:
            if r.x0 > x0 + 0.5 or r.x1 < x1 - 0.5 or r.width < 2:
                continue
            if r.height < 1.5:  # horizontal rule above/below
                ok = (0 <= r.y0 - y < 1.6 * size) or (0 <= top - r.y1 < 1.6 * size)
            else:  # box around the text, or a box directly below/above it
                ok = (r.y0 <= top + 0.5 and r.y1 >= y - 0.5) or (
                    kind == "rect" and ((0 <= r.y0 - y < 1.6 * size) or (0 <= top - r.y1 < 1.6 * size))
                )
            if ok and (best is None or r.width < best.width):
                best = r
        return best

    def infer_align(self, u: Unit) -> str:
        grp = self.group(u)
        x0, x1, y, size = self.box(grp)
        text = " ".join(v.text for v in grp).strip()
        if len(text.replace(" ", "")) <= 2 and not text[:1].isdigit():
            return "center"
        # stacked labels sharing a centre (e.g. "M" above "MANDAG")
        cx = (x0 + x1) / 2
        for v in self.units:
            if v is u or v.chain is not None and v.chain == u.chain:
                continue
            if abs(v.y - y) < 0.6 or abs(v.y - y) > 3 * max(size, v.size):
                continue
            if abs((v.x0 + v.x1) / 2 - cx) < 1.5 and abs(v.x0 - x0) > 2:
                return "center"
        c = self.container(grp)
        if c is None:
            return "left"
        m1, m2 = x0 - c.x0, c.x1 - x1
        if m1 > 1.5 and m2 > 1.5 and abs(m1 - m2) <= max(2.0, 0.08 * c.width):
            return "center"
        if m1 > 0.15 * c.width and m2 > 0.15 * c.width:  # centred by eye in a cell
            return "center"
        if m2 < 3 and m1 > max(8.0, 0.2 * c.width):
            return "right"
        return "left"

    def limits(self, grp: list[Unit], extra=()) -> tuple[float, float, bool]:
        """Free horizontal space around a unit/chain on its text band.

        Returns (left, right, field_after): field_after is True when the unit
        is a label directly followed by a fill-in field or line, in which case
        a longer translation may grow to the left instead.
        """
        x0, x1, y, size = self.box(grp)
        band0, band1 = y - 0.7 * size, y + 0.2 * size
        W = self.page.rect.width
        left, right = min(x0, 14.0), max(x1, W - 14.0)
        short = len("".join(v.text for v in grp).replace(" ", "")) <= 2
        c = self.container(grp)
        if c is not None and not short:
            pad = 0.0
            if c.height >= 1.5:  # inside a box: keep (some of) the original inner margin
                pad = max(0.0, min(x0 - c.x0, c.x1 - x1, 6.0))
            left, right = max(left, min(c.x0 + pad, x0)), min(right, max(c.x1 - pad, x1))
        members = {id(v) for v in grp}
        obstacles = [(r, "art") for r, _ in self.prims] + [(w, "field") for w in self.widgets]
        obstacles += [
            (pymupdf.Rect(v.x0, v.y - 0.7 * v.size, v.x1, v.y), "text") for v in self.units if id(v) not in members
        ]
        obstacles += [(r, "new") for r in extra]
        field_after = False
        for r, kind in obstacles:
            if not (r.y0 < band1 and r.y1 > band0):
                continue
            if kind == "new":  # another re-laid-out label: keep a clear gap
                if r.x0 >= x0:
                    right = min(right, r.x0 - 5.0)
                else:
                    left = max(left, r.x1 + 5.0)
                continue
            if r.x0 >= x1 - 1:
                lim = r.x0 - min(3.0, max(0.0, r.x0 - x1))
                if lim < right:
                    right = lim
                    field_after = kind == "field" or (kind == "art" and r.x0 - x1 < 8 and r.height < 1.5)
            elif r.x1 <= x0 + 1:
                left = max(left, r.x1 + min(3.0, max(0.0, x0 - r.x1)))
        return left, right, field_after


# --------------------------------------------------------------------------
# Fonts: metrics, kerning, subsetting
# --------------------------------------------------------------------------


class FontInfo:
    def __init__(self, path: Path):
        self.path = path
        self.tt = TTFont(path)
        self.cmap = self.tt.getBestCmap()
        self.upem = self.tt["head"].unitsPerEm
        self.hmtx = self.tt["hmtx"]
        self._kern = self._load_kerning()

    def has(self, ch: str) -> bool:
        return ord(ch) in self.cmap

    def adv(self, ch: str) -> float:
        return self.hmtx[self.cmap[ord(ch)]][0] / self.upem

    def _load_kerning(self):
        subtables = []
        if "GPOS" not in self.tt:
            return subtables
        gpos = self.tt["GPOS"].table
        idx = set()
        for fr in gpos.FeatureList.FeatureRecord:
            if fr.FeatureTag == "kern":
                idx.update(fr.Feature.LookupListIndex)
        for i in sorted(idx):
            lk = gpos.LookupList.Lookup[i]
            for st in lk.SubTable:
                if lk.LookupType == 9:
                    st = st.ExtSubTable
                if getattr(st, "LookupType", 2) == 2 or st.__class__.__name__ == "PairPos":
                    subtables.append((i, st))
        return subtables

    @lru_cache(maxsize=None)
    def kern(self, a: str, b: str) -> float:
        ga, gb = self.cmap.get(ord(a)), self.cmap.get(ord(b))
        if ga is None or gb is None:
            return 0.0
        total, done = 0.0, set()
        for li, st in self._kern:
            if li in done or ga not in st.Coverage.glyphs:
                continue
            if st.Format == 1:
                ps = st.PairSet[st.Coverage.glyphs.index(ga)]
                for rec in ps.PairValueRecord:
                    if rec.SecondGlyph == gb:
                        v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                        total += v or 0
                        done.add(li)
                        break
            elif st.Format == 2:
                c1 = st.ClassDef1.classDefs.get(ga, 0)
                c2 = st.ClassDef2.classDefs.get(gb, 0)
                rec = st.Class1Record[c1].Class2Record[c2]
                v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                total += v or 0
                done.add(li)
        return total / self.upem

    def layout(self, text: str, size: float, tc: float):
        """Return ([(char, x_offset)], width) for one line of text."""
        xs, x = [], 0.0
        for i, ch in enumerate(text):
            if i:
                x += self.kern(text[i - 1], ch) * size
            xs.append((ch, x))
            x += self.adv(ch) * size + (tc if i < len(text) - 1 else 0)
        return xs, x


@lru_cache(maxsize=None)
def font_info(path: str) -> FontInfo:
    return FontInfo(Path(path))


def subset_font(path: Path, chars: str) -> bytes:
    tt = TTFont(path)
    opts = Options()
    opts.layout_features = []
    opts.notdef_outline = True
    opts.name_IDs = ["*"]
    opts.drop_tables += ["GPOS", "GSUB", "GDEF"]
    sub = Subsetter(opts)
    sub.populate(text=chars)
    sub.subset(tt)
    buf = io.BytesIO()
    tt.save(buf)
    return buf.getvalue()


# --------------------------------------------------------------------------
# Translation JSON
# --------------------------------------------------------------------------


def unit_record(u: Unit) -> dict:
    return {
        "id": u.uid,
        "page": u.page + 1,
        "src": u.text,
        "font": u.main.font,
        "size": round(u.size, 2),
        "bbox": [round(u.x0, 1), round(u.y - 0.75 * u.size, 1), round(u.x1, 1), round(u.y, 1)],
        "align": u.align,
        "chain": u.chain,
    }


def extract_doc(path: Path) -> list[Unit]:
    doc = pymupdf.open(path)
    out = []
    for page in doc:
        out.extend(extract_units(page))
    return out


def write_skeleton(src: Path, tdir: Path) -> Path:
    slug = src.stem
    units = extract_doc(src)
    path = tdir / f"{slug}.json"
    old = {}
    if path.exists():
        old = {r["id"]: r for r in json.loads(path.read_text())["units"]}
    recs = []
    for u in units:
        r = unit_record(u)
        prev = old.get(u.uid)
        if prev and prev["src"] == r["src"]:
            for k, v in prev.items():
                if k in LANGS or k in ("note", "fit", "dx", "scale", "join", "align_manual", "font_override"):
                    r[k] = v
            if prev.get("align_manual"):
                r["align"] = prev["align"]
        recs.append(r)
    tdir.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"slug": slug, "source": f"{slug}.pdf", "units": recs}, ensure_ascii=False, indent=1) + "\n")
    return path


def load_translations(path: Path) -> dict:
    data = json.loads(path.read_text())
    return {r["id"]: r for r in data["units"]}


# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------


def widget_signature(doc: pymupdf.Document):
    sig = []
    for page in doc:
        for w in page.widgets():
            sig.append((page.number, w.field_name, w.field_type, tuple(round(v, 2) for v in w.rect), w.field_value))
    return sig


def rgb(color: int) -> tuple[float, float, float]:
    return ((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255


def fmt(v: float) -> str:
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    return s if s not in ("-0", "") else "0"


class Problems(list):
    def warn(self, msg):
        self.append(msg)


def build_one(src: Path, tpath: Path, fonts: Path, out: Path, lang: str, problems: Problems, verbose=False) -> dict:
    """Build one translated PDF.

    MuPDF's redaction filter occasionally drops a graphics-state operator that
    precedes a removed text run (e.g. the stroke width of faux-bold labels), which
    changes how *untouched* text is painted.  Every untouched unit is therefore
    compared with the source after redaction; units whose appearance changed are
    re-drawn as well and the file is rebuilt (until stable).
    """
    force: set = set()
    for _ in range(5):
        sub = Problems()
        changed = _build(src, tpath, fonts, out, lang, sub, verbose, force)
        if not changed:
            problems.extend(sub)
            return {}
        force |= changed
    problems.extend(sub)
    problems.warn(f"{src.stem}/{lang}: untouched text still changes after redaction: {sorted(changed)}")
    return {}


def _build(src, tpath, fonts, out, lang, problems, verbose, force) -> set:
    doc = pymupdf.open(src)
    trans = load_translations(tpath)
    before = widget_signature(doc)
    layout_report = []
    plans = []  # (page, list of draw ops)
    changed_units: set = set()
    info: dict = {"source": src.name, "lang": lang}
    for page in doc:
        units = extract_units(page)
        geo = Geometry(page, units)
        for u in units:
            rec = trans.get(u.uid)
            if rec is None or rec["src"] != u.text:
                raise SystemExit(f"{src.name}: translation file out of date at {u.uid} ({u.text!r}); rerun --extract")
            u.align = rec.get("align", u.align)
            new = rec.get(lang)
            if new is None:
                raise SystemExit(f"{src.name}: missing {lang} translation for {u.uid} {u.text!r}")
            u.new = new
            u.rec = rec
        changed_chains = set()
        targets = []
        for u in units:
            if u.new.strip() != u.text.strip() or (page.number, u.uid) in force:
                if u.align == "rotated":
                    raise SystemExit(f"{src.name} {u.uid}: rotated text cannot be translated")
                targets.append(u)
                if u.chain:
                    changed_chains.add(u.chain)
        for u in units:
            if u.chain in changed_chains and u not in targets:
                targets.append(u)
        if not targets:
            continue
        sig_before = trace_signature(page)
        art_before = sorted((tuple(round(v, 1) for v in d["rect"]), d["type"]) for d in page.get_drawings())
        # 1) remove original glyphs of the target units
        for u in targets:
            for p in u.parts:
                ink = p.ink
                r = pymupdf.Rect(ink[0].bbox[0] + 0.15, p.y - 0.62 * p.size, ink[-1].bbox[2] - 0.15, p.y - 0.12 * p.size)
                if r.width < 0.3:
                    r.x0, r.x1 = r.x0 - 0.2, r.x1 + 0.2
                page.add_redact_annot(r, fill=False)
        # 2) plan the new text (geometry is computed before redaction is applied)
        done = set()
        planned = []  # [grp, ops, box]
        for u in targets:
            if id(u) in done:
                continue
            grp = geo.group(u)
            for v in grp:
                done.add(id(v))
            planned.append([grp, *plan_group(page, geo, grp, fonts, lang, problems, layout_report, src.stem)])
        # two re-laid-out labels may now collide (both were fitted against the
        # original positions): re-fit the larger one against the new boxes
        for _ in range(3):
            clash = None
            for i, a in enumerate(planned):
                for b in planned[i + 1:]:
                    ma, mb = 0.25 * a[0][0].size, 0.25 * b[0][0].size
                    ra, rb = a[2] + (0, -ma, 0, ma), b[2] + (0, -mb, 0, mb)
                    clr = max(3.0, 0.6 * min(a[0][0].size, b[0][0].size))
                    if ra.y0 < rb.y1 and rb.y0 < ra.y1 and ra.x0 < rb.x1 + clr and rb.x0 < ra.x1 + clr:
                        clash = a if a[0][0].size >= b[0][0].size else b
                        break
                if clash:
                    break
            if not clash:
                break
            others = [q[2] for q in planned if q is not clash]
            clash[1], clash[2] = plan_group(page, geo, clash[0], fonts, lang, problems, layout_report, src.stem, others)
        ops = [op for q in planned for op in q[1]]
        plans.append((page.number, ops))
        info.setdefault("redrawn", []).extend(
            {"page": page.number + 1, "id": v.uid, "old": [round(c, 2) for c in (v.x0, v.y - v.size, v.x1, v.y + 0.3 * v.size)],
             "new": [round(c, 2) for c in (q[2].x0, q[2].y0 - 0.3 * v.size, q[2].x1, q[2].y1 + 0.3 * v.size)]}
            for q in planned for v in q[0]
        )
        page.apply_redactions(
            images=pymupdf.PDF_REDACT_IMAGE_NONE,
            graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
            text=pymupdf.PDF_REDACT_TEXT_REMOVE,
        )
        art_after = sorted((tuple(round(v, 1) for v in d["rect"]), d["type"]) for d in page.get_drawings())
        if art_after != art_before:
            problems.warn(f"{src.stem}/{lang} p{page.number + 1}: redaction changed vector drawings")
        # check that exactly the targeted text vanished
        keep = [u for u in units if u not in targets]
        sig_after = trace_signature(page)
        for k, look in sig_after.items():
            if sig_before.get(k) == look or k[2].isspace():
                continue
            # surviving glyph painted differently: find the kept unit it belongs to
            best, dist = None, 2.0
            for u in keep:
                for p in u.parts:
                    for ch in p.chars:
                        d = abs(ch.x - k[0]) + abs(ch.y - k[1])
                        if ch.c == k[2] and d < dist:
                            best, dist = u, d
            if best is None:
                problems.warn(f"{src.stem}/{lang} p{page.number + 1}: glyph {k} changed and no unit found")
            else:
                changed_units.add((page.number, best.uid))
        remaining = "".join(page.get_text("text").split())
        expected = "".join("".join(u.text.split()) for u in keep)
        if sorted(remaining) != sorted(expected):
            problems.warn(
                f"{src.stem}/{lang} p{page.number + 1}: text left after redaction differs "
                f"(extra={sorted((set(remaining) - set(expected)))} missing={sorted(set(expected) - set(remaining))})"
            )
    # 3) draw: subset each font once for the whole document
    used: dict[str, set] = {}
    for _, ops in plans:
        for op in ops:
            used.setdefault(op["font"], set()).update(op["text"])
    font_res = {}
    for i, (fpath, chars) in enumerate(sorted(used.items())):
        buf = subset_font(Path(fpath), "".join(sorted(chars)))
        font_res[fpath] = (f"TrF{i}", buf, pymupdf.Font(fontbuffer=buf))
    for pno, ops in plans:
        page = doc[pno]
        if not ops:
            continue
        page.wrap_contents()
        inserted = set()
        stream = ["q"]
        m = ~page.transformation_matrix
        for op in ops:
            name, buf, fobj = font_res[op["font"]]
            if name not in inserted:
                page.insert_font(fontname=name, fontbuffer=buf)
                inserted.add(name)
            r, g, b = rgb(op["color"])
            pt = pymupdf.Point(op["x"], op["y"]) * m
            arr = []
            prev_off = 0.0
            for ch, off in op["glyphs"]:
                gid = fobj.has_glyph(ord(ch))
                if not gid:
                    problems.warn(f"{src.stem}/{lang}: glyph {ch!r} missing in {Path(op['font']).name}")
                # adjustment relative to natural advance (kerning)
                arr.append((gid, off))
            # build TJ with kerning adjustments
            tj = []
            nat = 0.0
            text = op["text"]
            for i, (gid, off) in enumerate(arr):
                if i:
                    delta = off - nat
                    if abs(delta) > 1e-3:
                        tj.append(fmt(-delta * 1000 / op["size"]))
                tj.append(f"<{gid:04x}>")
                nat = off + font_info(op["font"]).adv(text[i]) * op["size"] + op["tc"]
            mode = "0 Tr"
            if op["stroke"]:  # faux bold like the original: fill + thin stroke
                lw, (sr, sg, sb) = op["stroke"]
                mode = f"2 Tr {fmt(lw)} w 0 j {fmt(sr)} {fmt(sg)} {fmt(sb)} RG"
            stream.append(
                f"BT /{name} {fmt(op['size'])} Tf {fmt(op['tc'])} Tc 0 Tw {mode} {fmt(r)} {fmt(g)} {fmt(b)} rg "
                f"1 0 0 1 {fmt(pt.x)} {fmt(pt.y)} Tm [{' '.join(tj)}] TJ ET"
            )
        stream.append("Q")
        xref = doc.get_new_xref()
        doc.update_object(xref, "<<>>")
        doc.update_stream(xref, "\n".join(stream).encode())
        conts = page.get_contents()
        doc.xref_set_key(page.xref, "Contents", "[" + " ".join(f"{c} 0 R" for c in conts + [xref]) + "]")
    # subset prefix on BaseFont for the new fonts
    for page in doc:
        for f in page.get_fonts():
            if f[4].startswith("TrF") and "+" not in f[3]:
                digest = hashlib.md5(f"{src.stem}/{lang}/{f[4]}".encode()).digest()
                tag = "".join(chr(65 + b % 26) for b in digest[:6])
                base = re.sub(r"[^A-Za-z0-9-]", "-", doc.xref_get_key(f[0], "BaseFont")[1].lstrip("/").replace("#20", "-"))
                if "+" not in base:
                    doc.xref_set_key(f[0], "BaseFont", f"/{tag}+{base}")
                    kind, desc = doc.xref_get_key(f[0], "DescendantFonts")
                    if kind == "array":
                        dx = int(desc.strip("[] ").split()[0])
                        doc.xref_set_key(dx, "BaseFont", f"/{tag}+{base}")
                        fd = doc.xref_get_key(dx, "FontDescriptor")[1]
                        if fd.endswith("R"):
                            doc.xref_set_key(int(fd.split()[0]), "FontName", f"/{tag}+{base}")
    doc.set_metadata({**doc.metadata, "producer": f"PyMuPDF {pymupdf.VersionBind}"})
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(out, garbage=3, deflate=True)
    doc.close()
    info_path = ROOT / "build-info" / lang / f"{src.stem}.json"
    info_path.parent.mkdir(parents=True, exist_ok=True)
    info_path.write_text(json.dumps(info, ensure_ascii=False, indent=1) + "\n")
    after = widget_signature(pymupdf.open(out))
    if after != before:
        problems.warn(f"{src.stem}/{lang}: widgets changed")
    if verbose and not changed_units:
        for line in layout_report:
            print("   ", line)
    return changed_units


def plan_group(page, geo: Geometry, grp: list[Unit], fonts: Path, lang, problems, report, slug, extra=()):
    """Lay out one unit/chain; returns (draw ops, new text box)."""
    x0, x1, y, size = geo.box(grp)
    align = grp[0].align
    pieces = []
    for v in grp:
        src_font = v.rec.get("font_override") or v.main.font
        fname = FONT_MAP.get(src_font)
        if fname is None:
            raise SystemExit(f"no font mapping for {src_font}")
        fi = font_info(str(fonts / fname))
        text = v.new.strip()
        for ch in text:
            if not fi.has(ch):
                problems.warn(f"{slug}/{lang} {v.uid}: {ch!r} not in {fname}")
        pieces.append((v, fi, text, v.tracking_em()))
    gaps = [b.x0 - a.x1 for a, b in zip(grp, grp[1:])]
    for i, v in enumerate(grp[1:]):
        # "join": languages where this chain member is glued to the previous one
        # (compound word in two weights, e.g. WOCHEN|PLAN): gap = letter spacing
        if lang in v.rec.get("join", []):
            prev = pieces[i]
            gaps[i] = prev[3] * prev[0].size

    def total(scale):
        w = 0.0
        for v, fi, text, trk in pieces:
            s = v.size * scale
            w += fi.layout(text, s, trk * s)[1] if text else 0
        return w + sum(gaps) * scale

    left, right, field_after = geo.limits(grp, extra)
    def override(key, default):
        # manual layout overrides in the JSON: a number, or {lang: number}
        v = grp[0].rec.get(key, default)
        if isinstance(v, dict):
            v = v.get(lang, default)
        return v

    fit = override("fit", None)  # max width in pt
    grow_left = align == "left" and field_after and total(1.0) > right - x0
    cx = (x0 + x1) / 2
    avails = {"left": right - x0, "right": x1 - left, "center": 2 * min(cx - left, right - cx)}
    avail = avails[align]
    if grow_left:
        # label followed by a field: may move left (as little as needed)
        avail = right - left
    short = len("".join(p[2] for p in pieces).replace(" ", "")) <= 2
    if short and total(1.0) > avail:
        # initials next to a cell edge: use whichever anchoring leaves most room
        align = max(avails, key=lambda k: (avails[k], k == align))
        avail = avails[align]
    avail = max(avail, x1 - x0)
    if fit:
        avail = float(fit)
    width = total(1.0)
    scale = float(override("scale", 1.0))
    if width * scale > avail:
        scale = avail / width
    if scale < MIN_SCALE - 1e-3:
        problems.warn(
            f"{slug}/{lang} {grp[0].uid}: {' '.join(p[2] for p in pieces)!r} needs scale {scale:.2f} "
            f"(width {width:.1f} > avail {avail:.1f})"
        )
    w = total(scale)
    dx = float(override("dx", 0.0))
    if grow_left:
        start = max(left, min(x0, right - w))
    elif align == "left":
        start = x0
    elif align == "right":
        start = x1 - w
    else:
        start = (x0 + x1) / 2 - w / 2
    start += dx
    report.append(f"{grp[0].uid} {align:6} scale={scale:.2f} avail={avail:6.1f} w={w:6.1f} {' | '.join(p[2] for p in pieces)}")
    ops = []
    x = start
    for i, (v, fi, text, trk) in enumerate(pieces):
        s = v.size * scale
        glyphs, wd = fi.layout(text, s, trk * s)
        if text:
            st = v.main.stroke
            ops.append(
                {"font": str(fi.path), "text": text, "size": s, "tc": trk * s, "x": x, "y": v.y,
                 "color": v.main.color, "glyphs": glyphs,
                 "stroke": (st[0] * scale, st[1]) if st else None}
            )
        x += wd + (gaps[i] * scale if i < len(gaps) else 0)
    box = pymupdf.Rect(start, y - 0.7 * size * scale, start + w, y)
    return ops, box


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--source", type=Path, default=ROOT / "source")
    ap.add_argument("--translations", type=Path, default=ROOT / "translations")
    ap.add_argument("--fonts", type=Path, default=ROOT / "fonts")
    ap.add_argument("--out", type=Path, default=ROOT / "out")
    ap.add_argument("--lang", action="append", choices=LANGS)
    ap.add_argument("--slug", action="append")
    ap.add_argument("--extract", action="store_true", help="(re)write translation JSON skeletons")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()
    sources = sorted(args.source.glob("*.pdf"))
    if args.slug:
        sources = [s for s in sources if s.stem in args.slug]
    if args.extract:
        for s in sources:
            print("wrote", write_skeleton(s, args.translations))
        return 0
    problems = Problems()
    for s in sources:
        tpath = args.translations / f"{s.stem}.json"
        if not tpath.exists():
            print(f"skip {s.stem}: no translations")
            continue
        for lang in args.lang or LANGS:
            n = len(problems)
            build_one(s, tpath, args.fonts, args.out / lang / s.name, lang, problems, args.verbose)
            print(f"{lang}/{s.name}: {'ok' if len(problems) == n else 'WARN'}")
    for p in problems:
        print("WARN", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
