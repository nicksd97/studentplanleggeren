#!/usr/bin/env python3
"""Render the vertical TikTok/Reels videos for Student Planlegger.

    pip install pillow numpy pymupdf fonttools brotli
    python3 scripts/build-social-videos.py [--only 1,2,3] [--preview T]

Free sample:  assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf (may be shown in full)
Paid PDFs:    $PAID_DIR (default /opt/cursor/artifacts/fixed-planners). Never commit them.
              Paid pages are only ever shown zoomed in (MIN_PAID_SCALE), enforced per frame.
Output:       $OUT_DIR (default /opt/cursor/artifacts/social-videos)
"""
from __future__ import annotations

import argparse
import math
import os
import subprocess
import sys
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

import numpy as np
import pymupdf
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PAID_DIR = Path(os.environ.get("PAID_DIR", "/opt/cursor/artifacts/fixed-planners"))
OUT_DIR = Path(os.environ.get("OUT_DIR", "/opt/cursor/artifacts/social-videos"))
FONT_CACHE = Path(os.environ.get("FONT_CACHE", "/tmp/sp-video-fonts"))
FREE_PDF = ROOT / "assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf"
MONTSERRAT = ROOT / "assets/lead-magnet/fonts/Montserrat-Medium.ttf"

W, H, FPS = 1080, 1920, 30

# Site palette (app/globals.css)
DARK = (61, 50, 41)
MEDIUM = (139, 115, 85)
ACCENT = (196, 168, 130)
SOFT = (229, 226, 221)
PALE = (245, 240, 234)
CREAM = (250, 248, 245)
INK = (43, 39, 36)

# iPad geometry (global px)
IPAD = (110, 640, 970, 1790)
SCREEN = (136, 666, 944, 1764)
SW, SH = SCREEN[2] - SCREEN[0], SCREEN[3] - SCREEN[1]
STATUS_H, TOOLBAR_H = 34, 58
VIEW_Y0 = SCREEN[1] + STATUS_H + TOOLBAR_H  # 758
VW, VH = SW, SCREEN[3] - VIEW_Y0  # 808 x 1006
VIEW_CX, VIEW_CY = SCREEN[0] + VW / 2, VIEW_Y0 + VH / 2

# A paid page must never be shown at fit-width (1.36 px/pt). At 1.9 px/pt at most
# ~46% of the page area fits in the viewport.
MIN_PAID_SCALE = 1.9
PAD_PT = 80
CANVAS_BG = (232, 229, 224)


# ---------------------------------------------------------------- fonts

def _static_font(src: Path, wght: int, name: str) -> str:
    FONT_CACHE.mkdir(parents=True, exist_ok=True)
    out = FONT_CACHE / f"{name}-{wght}.ttf"
    if not out.exists():
        f = TTFont(src)
        f.flavor = None
        instancer.instantiateVariableFont(f, {"wght": wght}, inplace=True)
        f.save(out)
    return str(out)


@lru_cache(maxsize=None)
def font(kind: str, size: float) -> ImageFont.FreeTypeFont:
    if kind == "mono":
        return ImageFont.truetype(str(MONTSERRAT), size)
    fam, wght = kind.split("-")
    src = ROOT / ("app/fonts/playfair-display-latin.woff2" if fam == "playfair" else "app/fonts/dm-sans-latin.woff2")
    return ImageFont.truetype(_static_font(src, int(wght), fam), size)


def text_w(f, s, tracking=0.0):
    return f.getlength(s) + tracking * max(len(s) - 1, 0)


def draw_tracked(d: ImageDraw.ImageDraw, xy, s, f, fill, tracking):
    x, y = xy
    for ch in s:
        d.text((x, y), ch, font=f, fill=fill, anchor="ls")
        x += f.getlength(ch) + tracking


# ---------------------------------------------------------------- easing

def clamp01(x):
    return 0.0 if x < 0 else 1.0 if x > 1 else x


def ease_io(x):
    x = clamp01(x)
    return 4 * x * x * x if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def ease_out(x):
    x = clamp01(x)
    return 1 - (1 - x) ** 3


def lerp(a, b, u):
    return a + (b - a) * u


# ---------------------------------------------------------------- pages and marks

@dataclass
class Mark:
    t0: float
    t1: float
    kind: str  # type | tick | hl | fill | ring
    data: dict
    tool: str

    def pencil_point(self, u):
        """Pencil tip in page points at stroke progress u."""
        if self.kind == "tick":
            return _along(self.data["pts"], u)
        if self.kind in ("hl", "fill"):
            x0, y0, x1, y1 = self.data["rect"]
            return (lerp(x0, x1, u), (y0 + y1) / 2 + (y1 - y0) * 0.25 * math.sin(u * 6))
        if self.kind == "ring":
            cx, cy, rx, ry = self.data["ell"]
            a = -math.pi / 2 + u * 2.15 * math.pi
            return (cx + rx * math.cos(a), cy + ry * math.sin(a))
        return None


def _along(pts, u):
    seg = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    total = sum(seg)
    target = clamp01(u) * total
    for i, L in enumerate(seg):
        if target <= L or i == len(seg) - 1:
            v = 0 if L == 0 else min(target / L, 1)
            return (lerp(pts[i][0], pts[i + 1][0], v), lerp(pts[i][1], pts[i + 1][1], v))
        target -= L
    return pts[-1]


def _partial(pts, u):
    seg = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    target = clamp01(u) * sum(seg)
    out = [pts[0]]
    for i, L in enumerate(seg):
        if target >= L:
            out.append(pts[i + 1])
            target -= L
        else:
            v = target / L if L else 0
            out.append((lerp(pts[i][0], pts[i + 1][0], v), lerp(pts[i][1], pts[i + 1][1], v)))
            break
    return out


class Page:
    LEVELS = (2.0, 4.0)

    def __init__(self, key: str, path: Path, title: str, paid: bool):
        self.key, self.title, self.paid = key, title, paid
        doc = pymupdf.open(path)
        pg = doc[0]
        self.w, self.h = pg.rect.width, pg.rect.height
        self.imgs = {}
        for k in self.LEVELS:
            pix = pg.get_pixmap(matrix=pymupdf.Matrix(k, k), alpha=False)
            page_img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            pad = int(PAD_PT * k)
            canvas = Image.new("RGB", (page_img.width + 2 * pad, page_img.height + 2 * pad), CANVAS_BG)
            sh = Image.new("L", canvas.size, 0)
            ImageDraw.Draw(sh).rectangle((pad, pad + int(2 * k), pad + page_img.width, pad + page_img.height + int(2 * k)), fill=70)
            sh = sh.filter(ImageFilter.GaussianBlur(5 * k))
            canvas.paste((150, 140, 128), mask=sh)
            canvas.paste(page_img, (pad, pad))
            self.imgs[k] = canvas
        self.marks: list[Mark] = []

    # Marks. All coordinates in PDF points (top-left origin).
    def type(self, t, rect, text, size=9.0, cps=18.0):
        n = len(text)
        t1 = t + n / cps
        for m in self.marks:
            if m.kind == "type" and m.t0 < t and m.data.get("until", m.t1 + 0.45) > t - 0.15:
                m.data["until"] = t - 0.15
        self.marks.append(Mark(t, t1, "type", dict(rect=rect, text=text, size=size, cps=cps), "text"))
        return t1

    def tick(self, t, box, dur=0.3):
        x0, y0, x1, y1 = box
        w, h = x1 - x0, y1 - y0
        pts = [(x0 + 0.2 * w, y0 + 0.55 * h), (x0 + 0.42 * w, y0 + 0.8 * h), (x0 + 0.95 * w, y0 + 0.05 * h)]
        self.marks.append(Mark(t, t + dur, "tick", dict(pts=pts, width=1.5), "pen"))
        return t + dur

    def highlight(self, t, rect, dur=0.4, color=(236, 222, 199)):
        self.marks.append(Mark(t, t + dur, "hl", dict(rect=rect, color=color), "highlighter"))
        return t + dur

    def fill(self, t, rect, dur=0.25, color=(236, 222, 199)):
        self.marks.append(Mark(t, t + dur, "fill", dict(rect=rect, color=color), "highlighter"))
        return t + dur

    def ring(self, t, rect, dur=0.45):
        x0, y0, x1, y1 = rect
        ell = ((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 2.5, (y1 - y0) / 2 + 2.5)
        self.marks.append(Mark(t, t + dur, "ring", dict(ell=ell), "pen"))
        return t + dur

    # Rendering
    def view(self, t, cx, cy, s) -> Image.Image:
        if self.paid and s < MIN_PAID_SCALE - 1e-6:
            raise AssertionError(f"{self.key}: paid page shown at scale {s:.3f} < {MIN_PAID_SCALE}")
        k = self.LEVELS[0] if s * 1.3 <= self.LEVELS[0] else self.LEVELS[-1]
        img = self.imgs[k]
        vw_pt, vh_pt = VW / s, VH / s
        l = (cx - vw_pt / 2 + PAD_PT) * k
        tp = (cy - vh_pt / 2 + PAD_PT) * k
        r, b = l + vw_pt * k, tp + vh_pt * k
        il, it = max(int(math.floor(l)) - 2, 0), max(int(math.floor(tp)) - 2, 0)
        ir, ib = min(int(math.ceil(r)) + 2, img.width), min(int(math.ceil(b)) + 2, img.height)
        crop = img.crop((il, it, ir, ib))
        self._draw_marks(crop, t, il, it, k)
        return crop.resize((VW, VH), Image.LANCZOS, box=(l - il, tp - it, r - il, b - it))

    def _draw_marks(self, crop, t, ox, oy, k):
        def P(x, y):
            return ((x + PAD_PT) * k - ox, (y + PAD_PT) * k - oy)

        live = [m for m in self.marks if t >= m.t0 - 0.2]
        for m in live:
            if m.kind not in ("hl", "fill"):
                continue
            u = ease_io((t - m.t0) / (m.t1 - m.t0)) if m.kind == "hl" else ease_out((t - m.t0) / (m.t1 - m.t0))
            if u <= 0:
                continue
            x0, y0, x1, y1 = m.data["rect"]
            a, b = P(x0, y0), P(lerp(x0, x1, u) if m.kind == "hl" else x1, y1)
            if m.kind == "fill":
                cyy = (a[1] + b[1]) / 2
                hh = (b[1] - a[1]) / 2 * u
                a, b = (a[0], cyy - hh), (b[0], cyy + hh)
            box = tuple(int(v) for v in (a[0], a[1], b[0] + 1, b[1] + 1))
            if box[2] <= box[0] or box[3] <= box[1]:
                continue
            region = crop.crop(box)
            mask = Image.new("L", region.size, 0)
            rad = min(region.size[1] // 2, int(3 * k)) if m.kind == "hl" else int(1.2 * k)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, region.size[0] - 1, region.size[1] - 1), radius=rad, fill=255)
            mult = ImageChops.multiply(region, Image.new("RGB", region.size, m.data["color"]))
            region.paste(mult, mask=mask)
            crop.paste(region, box[:2])

        d = ImageDraw.Draw(crop)
        for m in live:
            if m.kind == "type":
                x0, y0, x1, y1 = m.data["rect"]
                f = font("mono", m.data["size"] * k)
                n = int(clamp01((t - m.t0) / (m.t1 - m.t0)) * len(m.data["text"]) + 1e-6)
                txt = m.data["text"][:n]
                tx, ty = P(x0 + 3, (y0 + y1) / 2 + 0.4)
                if txt:
                    d.text((tx, ty), txt, font=f, fill=INK, anchor="lm")
                editing = m.t0 - 0.15 <= t <= m.data.get("until", m.t1 + 0.45)
                if editing:
                    bx0, by0 = P(x0 - 1, y0 + 0.5)
                    bx1, by1 = P(x1 + 1, y1 - 0.5)
                    d.rounded_rectangle((bx0, by0, bx1, by1), radius=1.5 * k, outline=ACCENT, width=max(1, int(0.55 * k)))
                    for hx in (bx0, bx1):
                        hy = (by0 + by1) / 2
                        r_ = 1.4 * k
                        d.ellipse((hx - r_, hy - r_, hx + r_, hy + r_), fill=CREAM, outline=MEDIUM, width=max(1, int(0.4 * k)))
                    typing = t <= m.t1 + 0.05
                    if typing or (t * 2.2) % 1 < 0.6:
                        cxp = tx + f.getlength(txt) + 0.6 * k
                        hgt = m.data["size"] * 0.62 * k
                        d.rectangle((cxp, ty - hgt, cxp + 0.55 * k, ty + hgt), fill=MEDIUM)
            elif m.kind == "tick":
                u = ease_io((t - m.t0) / (m.t1 - m.t0))
                if u <= 0:
                    continue
                pts = [P(*p) for p in _partial(m.data["pts"], u)]
                wpx = m.data["width"] * k
                d.line(pts, fill=DARK, width=int(wpx), joint="curve")
                for p in (pts[0], pts[-1]):
                    d.ellipse((p[0] - wpx / 2, p[1] - wpx / 2, p[0] + wpx / 2, p[1] + wpx / 2), fill=DARK)
            elif m.kind == "ring":
                u = ease_io((t - m.t0) / (m.t1 - m.t0))
                if u <= 0:
                    continue
                cx_, cy_, rx, ry = m.data["ell"]
                pts = []
                for i in range(int(64 * u) + 2):
                    a = -math.pi / 2 + (i / 64) * 2.15 * math.pi * min(1, u * 64 / max(int(64 * u) + 1, 1))
                    wob = 1 + 0.04 * math.sin(a * 3)
                    pts.append(P(cx_ + rx * wob * math.cos(a), cy_ + ry * wob * math.sin(a)))
                d.line(pts, fill=MEDIUM, width=int(1.3 * k), joint="curve")


# ---------------------------------------------------------------- timeline

@dataclass
class Cam:
    t: float
    page: str
    cx: float
    cy: float
    s: float


@dataclass
class Video:
    slug: str
    duration: float
    label: str
    hook: str
    hook_end: float = 2.5
    hook_sub: str = ""
    clock: tuple = ("19:42", "19:42")
    battery: int = 82
    cams: list = field(default_factory=list)
    steps: list = field(default_factory=list)  # (t0, t1, number|None, kicker, text)
    weeks: list = field(default_factory=list)  # (t0, t1, set(active))
    end: tuple | None = None  # (t0, line, pill, small)
    cover_t: float = 0.0
    cover_title: str = ""
    pages: dict = field(default_factory=dict)

    def add_page(self, page: Page):
        self.pages[page.key] = page
        return page

    def clamp(self, page, cx, cy, s):
        p = self.pages[page]
        vw, vh = VW / s, VH / s
        cx = p.w / 2 if vw >= p.w else min(max(cx, vw / 2), p.w - vw / 2)
        cy = p.h / 2 if vh >= p.h else min(max(cy, vh / 2), p.h - vh / 2)
        return cx, cy

    def cam(self, t, page, s, focus=None, at=(190, 1000), center=None):
        if center is None:
            if focus is None:
                center = (self.pages[page].w / 2, self.pages[page].h / 2)
            else:
                center = (focus[0] + (VIEW_CX - at[0]) / s, focus[1] + (VIEW_CY - at[1]) / s)
        cx, cy = self.clamp(page, center[0], center[1], s)
        self.cams.append(Cam(t, page, cx, cy, s))

    def hold(self, t):
        c = self.cams[-1]
        self.cams.append(Cam(t, c.page, c.cx, c.cy, c.s))

    def camera(self, t):
        """Returns ("single", page, cx, cy, s) or ("swipe", u, camA, camB)."""
        cams = self.cams
        if t <= cams[0].t:
            c = cams[0]
            return ("single", c.page, c.cx, c.cy, c.s)
        for a, b in zip(cams, cams[1:]):
            if a.t <= t <= b.t:
                u = (t - a.t) / (b.t - a.t) if b.t > a.t else 1
                if a.page != b.page:
                    return ("swipe", ease_io(u), a, b)
                e = ease_io(u)
                s = math.exp(lerp(math.log(a.s), math.log(b.s), e))
                cx, cy = self.clamp(a.page, lerp(a.cx, b.cx, e), lerp(a.cy, b.cy, e), s)
                return ("single", a.page, cx, cy, s)
        c = cams[-1]
        return ("single", c.page, c.cx, c.cy, c.s)

    def to_screen(self, t, page, pt):
        cam = self.camera(t)
        if cam[0] != "single" or cam[1] != page:
            return None
        _, _, cx, cy, s = cam
        return (VIEW_CX + (pt[0] - cx) * s, VIEW_CY + (pt[1] - cy) * s)


# ---------------------------------------------------------------- static scene

def _noise(shape, sigma, seed):
    rng = np.random.default_rng(seed)
    return rng.normal(0, sigma, shape).astype(np.float32)


def build_desk(seed=7) -> Image.Image:
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    top = np.array([243, 238, 231], np.float32)
    bot = np.array([233, 226, 216], np.float32)
    g = (yy / H)[..., None]
    img = top * (1 - g) + bot * g
    # linen weave
    rows = np.repeat(_noise((H, 1), 1.0, seed), W, 1)
    cols = np.repeat(_noise((1, W), 1.0, seed + 1), H, 0)
    fine = _noise((H, W), 1.0, seed + 2)
    weave = (rows * 2.2 + cols * 1.6 + fine * 1.4)[..., None]
    img += weave * np.array([1.0, 0.95, 0.85], np.float32)
    # window light from the upper left, with soft mullion shadows
    diag = (xx * 0.55 + yy * 0.85)
    light = np.exp(-((diag - 380) / 700) ** 2) * 11
    shadow = np.zeros_like(diag)
    for c0 in (760, 1640):
        shadow += np.exp(-((diag - c0) / 46) ** 2) * 7
    img += (light - shadow)[..., None] * np.array([1.0, 0.97, 0.9], np.float32)
    # vignette
    r = ((xx - W / 2) / W) ** 2 + ((yy - H * 0.55) / H) ** 2
    img *= (1 - 0.22 * r)[..., None]
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def _rr_mask(size, box, radius, blur=0):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle(box, radius=radius, fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur)) if blur else m


def draw_mug(base: Image.Image, cx, cy, r):
    sh = Image.new("L", base.size, 0)
    ImageDraw.Draw(sh).ellipse((cx - r + 18, cy - r + 30, cx + r + 18, cy + r + 30), fill=95)
    base.paste((120, 100, 80), mask=sh.filter(ImageFilter.GaussianBlur(26)))
    d = ImageDraw.Draw(base)
    # handle
    d.rounded_rectangle((cx + r * 0.75, cy - r * 0.2, cx + r * 1.42, cy + r * 0.2), radius=int(r * 0.2), fill=(240, 236, 230), outline=(218, 211, 202), width=3)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(246, 243, 238))
    d.ellipse((cx - r * 0.97, cy - r * 0.97, cx + r * 0.97, cy + r * 0.97), outline=(226, 220, 212), width=4)
    ri = r * 0.8
    d.ellipse((cx - ri, cy - ri, cx + ri, cy + ri), fill=(214, 206, 196))
    rc = r * 0.74
    d.ellipse((cx - rc, cy - rc, cx + rc, cy + rc), fill=(92, 62, 42))
    crema = Image.new("L", base.size, 0)
    ImageDraw.Draw(crema).ellipse((cx - rc * 0.92, cy - rc * 0.92, cx + rc * 0.92, cy + rc * 0.92), outline=150, width=int(rc * 0.16))
    base.paste((156, 116, 82), mask=crema.filter(ImageFilter.GaussianBlur(6)))
    hl = Image.new("L", base.size, 0)
    ImageDraw.Draw(hl).ellipse((cx - rc * 0.5, cy - rc * 0.62, cx + rc * 0.05, cy - rc * 0.36), fill=70)
    base.paste((255, 245, 230), mask=hl.filter(ImageFilter.GaussianBlur(8)))


def draw_notebook(base: Image.Image):
    layer = Image.new("RGBA", (700, 520), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((40, 40, 660, 480), radius=18, fill=(250, 248, 245, 255))
    d.rounded_rectangle((30, 30, 650, 470), radius=18, fill=(214, 200, 180, 255))
    d.rectangle((560, 30, 576, 470), fill=(188, 170, 146, 255))
    layer = layer.rotate(-9, resample=Image.BICUBIC, expand=True)
    sh = Image.new("RGBA", layer.size, (90, 70, 50, 0))
    sh.putalpha(layer.getchannel("A").point(lambda v: v * 0.35).filter(ImageFilter.GaussianBlur(20)))
    pos = (-260, 1660)
    base.paste(sh, (pos[0] + 16, pos[1] + 26), sh)
    base.paste(layer, pos, layer)


def build_scene_base() -> tuple[Image.Image, Image.Image]:
    base = build_desk()
    draw_notebook(base)
    draw_mug(base, 40, 150, 165)
    x0, y0, x1, y1 = IPAD
    sh = _rr_mask(base.size, (x0 + 10, y0 + 40, x1 - 10, y1 + 34), 70, blur=38)
    base.paste((95, 78, 60), mask=sh.point(lambda v: v * 0.42))
    sh2 = _rr_mask(base.size, (x0 + 4, y0 + 10, x1 - 4, y1 + 8), 60, blur=8)
    base.paste((80, 66, 52), mask=sh2.point(lambda v: v * 0.35))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(IPAD, radius=58, fill=(201, 197, 191))
    d.rounded_rectangle((x0 + 2, y0 + 2, x1 - 2, y1 - 2), radius=56, fill=(222, 219, 214))
    d.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=52, fill=(22, 22, 24))
    d.ellipse((540 - 5, y0 + 13 - 5, 540 + 5, y0 + 13 + 5), fill=(44, 46, 52))
    screen_mask = _rr_mask((SW, SH), (0, 0, SW - 1, SH - 1), 34)
    return base, screen_mask


def status_bar(clock: str, battery: int) -> Image.Image:
    im = Image.new("RGB", (SW, STATUS_H), (247, 246, 244))
    d = ImageDraw.Draw(im)
    f = font("dmsans-600", 19)
    d.text((26, STATUS_H / 2 + 1), clock, font=f, fill=(26, 26, 26), anchor="lm")
    bx = SW - 70
    d.rounded_rectangle((bx, 11, bx + 38, 25), radius=4, outline=(26, 26, 26), width=2)
    d.rectangle((bx + 3, 14, bx + 3 + int(32 * battery / 100), 22), fill=(26, 26, 26))
    d.rectangle((bx + 39, 15, bx + 42, 21), fill=(26, 26, 26))
    fs = font("dmsans-600", 16)
    d.text((bx - 8, STATUS_H / 2 + 1), f"{battery} %", font=fs, fill=(26, 26, 26), anchor="rm")
    wx, wy = bx - 72, 26
    for i, rr in enumerate((4, 9, 14)):
        d.arc((wx - rr, wy - rr, wx + rr, wy + rr), 225, 315, fill=(26, 26, 26), width=3)
    return im


@lru_cache(maxsize=None)
def toolbar(title: str, tool: str) -> Image.Image:
    im = Image.new("RGB", (SW, TOOLBAR_H), (247, 246, 244))
    d = ImageDraw.Draw(im)
    d.line((0, TOOLBAR_H - 1, SW, TOOLBAR_H - 1), fill=(224, 220, 214), width=1)
    c = (70, 62, 54)
    y = TOOLBAR_H / 2
    d.line([(34, y - 10), (24, y), (34, y + 10)], fill=c, width=3, joint="curve")
    for i in range(2):
        for j in range(2):
            d.rounded_rectangle((52 + i * 11, y - 10 + j * 11, 61 + i * 11, y - 1 + j * 11), radius=2, outline=c, width=2)
    d.text((SW / 2 - 40, y), title, font=font("dmsans-600", 19), fill=DARK, anchor="mm")
    tools = ["pen", "highlighter", "eraser", "text"]
    x = SW - 252
    for name in tools:
        if name == tool:
            d.rounded_rectangle((x - 21, y - 20, x + 21, y + 20), radius=10, fill=(236, 228, 216))
        if name == "pen":
            d.polygon([(x - 3, y + 12), (x + 3, y + 12), (x + 3, y - 6), (x, y - 13), (x - 3, y - 6)], outline=c, width=2)
        elif name == "highlighter":
            d.polygon([(x - 5, y + 12), (x + 5, y + 12), (x + 5, y - 4), (x + 2, y - 12), (x - 2, y - 10), (x - 5, y - 4)], fill=ACCENT, outline=c)
        elif name == "eraser":
            d.rounded_rectangle((x - 9, y - 7, x + 9, y + 9), radius=3, outline=c, width=2)
            d.line((x - 9, y + 2, x + 9, y + 2), fill=c, width=2)
        else:
            d.text((x, y + 1), "T", font=font("dmsans-700", 24), fill=c, anchor="mm")
        x += 50
    d.ellipse((x - 9, y - 9, x + 9, y + 9), fill=DARK, outline=(210, 204, 196), width=2)
    return im


def build_pencil():
    """Apple-Pencil-like stylus, tip at returned offset, body toward lower right."""
    S = 2
    L, w = 760, 13
    dx, dy = 0.5, 0.866
    nx, ny = -dy, dx
    size = (int((L * dx + 60) * S), int((L * dy + 60) * S))
    tip = (30 * S, 30 * S)
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    def P(a, b):
        return (tip[0] + (a * dx + b * nx) * S, tip[1] + (a * dy + b * ny) * S)

    bands = [(-w, -w * 0.55, (214, 213, 209)), (-w * 0.55, w * 0.1, (247, 247, 245)), (w * 0.1, w * 0.6, (238, 238, 235)), (w * 0.6, w, (205, 204, 200))]
    for b0, b1, col in bands:
        d.polygon([P(48, b0), P(L, b0), P(L, b1), P(48, b1)], fill=col + (255,))
        d.polygon([P(14, b0 * 0.3), P(48, b0), P(48, b1), P(14, b1 * 0.3)], fill=col + (255,))
    d.polygon([P(0, 0), P(14, -w * 0.3), P(14, w * 0.3)], fill=(70, 70, 72, 255))
    d.line([P(48, -w), P(48, w)], fill=(200, 199, 195, 255), width=S)
    d.line([P(L, -w), P(L, w)], fill=(190, 189, 185, 255), width=2 * S)
    im = im.resize((size[0] // S, size[1] // S), Image.LANCZOS)
    alpha = im.getchannel("A")
    sh_soft = Image.new("RGBA", im.size, (60, 45, 30, 0))
    sh_soft.putalpha(alpha.point(lambda v: v * 0.30).filter(ImageFilter.GaussianBlur(9)))
    sh_hard = Image.new("RGBA", im.size, (60, 45, 30, 0))
    sh_hard.putalpha(alpha.point(lambda v: v * 0.38).filter(ImageFilter.GaussianBlur(3)))
    return im, sh_soft, sh_hard, (tip[0] // S, tip[1] // S)


# ---------------------------------------------------------------- top text band

def _wrap_fit(lines, kind, size, max_w):
    while size > 30:
        f = font(kind, size)
        if all(text_w(f, ln) <= max_w for ln in lines):
            return f
        size -= 2
    return font(kind, size)


def block(width=W, height=420):
    return Image.new("RGBA", (width, height), (0, 0, 0, 0))


def label_block(label):
    im = block(height=60)
    d = ImageDraw.Draw(im)
    f = font("dmsans-600", 28)
    tr = 5.0
    tw = text_w(f, label, tr)
    x = (W - tw) / 2
    draw_tracked(d, (x, 40), label, f, MEDIUM, tr)
    d.line((x - 74, 30, x - 24, 30), fill=ACCENT, width=2)
    d.line((x + tw + 24, 30, x + tw + 74, 30), fill=ACCENT, width=2)
    return im


def title_block(title, sub="", size=98):
    lines = title.split("\n")
    f = _wrap_fit(lines, "playfair-800", size, 940)
    im = block(height=360)
    d = ImageDraw.Draw(im)
    lh = f.size * 1.06
    y = f.size * 0.95
    for ln in lines:
        d.text((W / 2, y), ln, font=f, fill=DARK, anchor="ms")
        y += lh
    if sub:
        fs = font("dmsans-500", 44)
        d.text((W / 2, y - lh + 70), sub, font=fs, fill=MEDIUM, anchor="ms")
    return im


def step_block(number, kicker, text):
    im = block(height=230)
    d = ImageDraw.Draw(im)
    f = _wrap_fit([text], "dmsans-700", 66, 900 if number is None else 820)
    y = 150
    if kicker:
        fk = font("dmsans-700", 30)
        tr = 4.0
        kw = text_w(fk, kicker, tr)
        draw_tracked(d, ((W - kw) / 2, 70), kicker, fk, MEDIUM, tr)
    tw = f.getlength(text)
    if number is not None:
        r = 38
        gap = 22
        total = 2 * r + gap + tw
        x = (W - total) / 2
        cy = y - f.size * 0.36
        d.ellipse((x, cy - r, x + 2 * r, cy + r), fill=ACCENT)
        d.text((x + r, cy + 1), str(number), font=font("dmsans-700", 40), fill=DARK, anchor="mm")
        d.text((x + 2 * r + gap, y), text, font=f, fill=DARK, anchor="ls")
    else:
        d.text((W / 2, y), text, font=f, fill=DARK, anchor="ms")
    return im


def weeks_block(active):
    im = block(height=70)
    d = ImageDraw.Draw(im)
    labels = ["U6", "U5", "U4", "U3", "U2", "U1"]
    cw, gap = 104, 14
    x = (W - (len(labels) * cw + (len(labels) - 1) * gap)) / 2
    f = font("dmsans-700", 27)
    for i, lab in enumerate(labels):
        on = i in active
        done = active and i < min(active)
        fill = DARK if on else (CREAM if not done else (236, 228, 216))
        d.rounded_rectangle((x, 10, x + cw, 60), radius=25, fill=fill, outline=DARK if on else ACCENT, width=2)
        d.text((x + cw / 2, 36), lab, font=f, fill=CREAM if on else (MEDIUM if not done else DARK), anchor="mm")
        x += cw + gap
    return im


def end_blocks(line, pill, small):
    f = _wrap_fit([line], "playfair-800", 80, 960)
    a = block(height=120)
    ImageDraw.Draw(a).text((W / 2, 92), line, font=f, fill=DARK, anchor="ms")
    b = block(height=110)
    d = ImageDraw.Draw(b)
    fp = font("dmsans-700", 42)
    pw = fp.getlength(pill) + 84
    d.rounded_rectangle(((W - pw) / 2, 12, (W + pw) / 2, 96), radius=42, fill=DARK)
    d.text((W / 2, 55), pill, font=fp, fill=CREAM, anchor="mm")
    c = block(height=60)
    fs = _wrap_fit([small], "dmsans-500", 31, 960)
    ImageDraw.Draw(c).text((W / 2, 40), small, font=fs, fill=MEDIUM, anchor="ms")
    return a, b, c


def paste_alpha(dst: Image.Image, im: Image.Image, xy, opacity=1.0):
    if opacity <= 0.003:
        return
    if opacity < 0.997:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: int(v * opacity)))
    dst.paste(im, (int(round(xy[0])), int(round(xy[1]))), im)


# ---------------------------------------------------------------- renderer

class Renderer:
    def __init__(self, v: Video):
        self.v = v
        self.base, self.screen_mask = build_scene_base()
        self.pencil, self.pencil_soft, self.pencil_hard, self.pencil_tip = build_pencil()
        self.label = label_block(v.label)
        self.title = title_block(v.hook, v.hook_sub)
        self.steps = [(t0, t1, step_block(n, k, txt)) for (t0, t1, n, k, txt) in v.steps]
        self.weeks = [(t0, t1, weeks_block(a)) for (t0, t1, a) in v.weeks]
        self.end = end_blocks(*v.end[1:]) if v.end else None
        self.grain = [(_noise((H, W, 1), 1.8, 100 + i)).astype(np.int16) for i in range(6)]
        self.strokes = sorted(
            [(m, key) for key, p in v.pages.items() for m in p.marks if m.kind != "type"], key=lambda x: x[0].t0
        )
        self.beats = [s[0] for s in v.steps] + ([v.end[0]] if v.end else [])

    # -- helpers
    def clock(self, t):
        a, b = self.v.clock
        ma = int(a[:2]) * 60 + int(a[3:])
        mb = int(b[:2]) * 60 + int(b[3:])
        m = int(ma + (mb - ma) * clamp01(t / self.v.duration))
        return f"{m // 60:02d}:{m % 60:02d}"

    def tool(self, t):
        best, tool = None, "text"
        for p in self.v.pages.values():
            for m in p.marks:
                if m.t0 - 0.45 <= t:
                    if best is None or m.t0 > best:
                        best, tool = m.t0, m.tool
        return tool

    def pencil_pos(self, t):
        """(x, y, pressed) in global px, or None."""
        off = (1240, 2180)
        prev = nxt = None
        for m, key in self.strokes:
            if m.t0 <= t <= m.t1:
                pt = self.v.to_screen(t, key, m.pencil_point((t - m.t0) / (m.t1 - m.t0)))
                return (*pt, True) if pt else None
            if m.t1 < t:
                prev = (m, key)
            elif m.t0 > t and nxt is None:
                nxt = (m, key)
        if prev and nxt and nxt[0].t0 - prev[0].t1 < 0.9 and prev[1] == nxt[1]:
            a = self.v.to_screen(t, prev[1], prev[0].pencil_point(1))
            b = self.v.to_screen(t, nxt[1], nxt[0].pencil_point(0))
            if a and b:
                u = ease_io((t - prev[0].t1) / (nxt[0].t0 - prev[0].t1))
                lift = math.sin(u * math.pi)
                return (lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 10 * lift, False)
        if nxt and nxt[0].t0 - t < 0.42:
            b = self.v.to_screen(nxt[0].t0, nxt[1], nxt[0].pencil_point(0))
            if b:
                u = ease_out(1 - (nxt[0].t0 - t) / 0.42)
                return (lerp(off[0], b[0], u), lerp(off[1], b[1], u), False)
        if prev and t - prev[0].t1 < 0.4:
            a = self.v.to_screen(prev[0].t1, prev[1], prev[0].pencil_point(1))
            if a:
                u = ease_io((t - prev[0].t1) / 0.4)
                return (lerp(a[0], off[0], u), lerp(a[1], off[1], u), False)
        return None

    def screen(self, t):
        v = self.v
        scr = Image.new("RGB", (SW, SH), CANVAS_BG)
        cam = v.camera(t)
        if cam[0] == "single":
            _, key, cx, cy, s = cam
            page = v.pages[key]
            scr.paste(page.view(t, cx, cy, s), (0, STATUS_H + TOOLBAR_H))
            title = page.title
        else:
            _, u, a, b = cam
            pa, pb = v.pages[a.page], v.pages[b.page]
            va, vb = pa.view(t, a.cx, a.cy, a.s), pb.view(t, b.cx, b.cy, b.s)
            dx = int(round(u * (VW + 24)))
            vy = STATUS_H + TOOLBAR_H
            scr.paste(va, (-dx, vy))
            scr.paste(vb, (VW + 24 - dx, vy))
            title = pa.title if u < 0.5 else pb.title
        scr.paste(status_bar(self.clock(t), v.battery), (0, 0))
        scr.paste(toolbar(title, self.tool(t)), (0, STATUS_H))
        return scr

    def scene(self, t):
        frame = self.base.copy()
        frame.paste(self.screen(t), SCREEN[:2], self.screen_mask)
        pp = self.pencil_pos(t)
        if pp:
            x, y, pressed = pp
            tx, ty = self.pencil_tip
            if pressed:
                frame.paste(self.pencil_hard, (int(x - tx + 7), int(y - ty + 9)), self.pencil_hard)
                frame.paste(self.pencil_soft, (int(x - tx + 16), int(y - ty + 20)), self.pencil_soft)
                frame.paste(self.pencil, (int(x - tx), int(y - ty)), self.pencil)
            else:
                frame.paste(self.pencil_soft, (int(x - tx + 30), int(y - ty + 40)), self.pencil_soft)
                frame.paste(self.pencil, (int(x - tx - 6), int(y - ty - 10)), self.pencil)
        # handheld drift + slow push + a small punch-in on each new step
        T = self.v.duration
        bump = sum(math.exp(-(t - b) * 7) * (1 - math.exp(-(t - b) * 30)) for b in self.beats if t >= b)
        z = 1.018 + 0.022 * (t / T) + 0.007 * bump
        dx = 3.2 * math.sin(2 * math.pi * t / 5.3) + 1.6 * math.sin(2 * math.pi * t / 2.3 + 1.0)
        dy = 2.6 * math.sin(2 * math.pi * t / 4.1 + 0.5) + 1.4 * math.sin(2 * math.pi * t / 1.9)
        rot = 0.0025 * math.sin(2 * math.pi * t / 6.7)
        ox, oy = 540, 1180
        ca, sa = math.cos(rot) / z, math.sin(rot) / z
        data = (ca, sa, ox - ca * (ox + dx) - sa * (oy + dy), -sa, ca, oy + sa * (ox + dx) - ca * (oy + dy))
        return frame.transform((W, H), Image.AFFINE, data, resample=Image.BICUBIC)

    def overlay(self, frame, t, cover=False):
        v = self.v
        if cover:
            paste_alpha(frame, self.label, (0, 262))
            paste_alpha(frame, title_block(v.cover_title or v.hook, v.hook_sub, size=110), (0, 318))
            return
        paste_alpha(frame, self.label, (0, 262))
        if t < v.hook_end:
            o = 1 - ease_io((t - (v.hook_end - 0.22)) / 0.22)
            paste_alpha(frame, self.title, (0, 318 - 18 * (1 - o)), o)
        for t0, t1, im in self.steps:
            if t0 <= t <= t1:
                ein = ease_out((t - t0) / 0.32)
                eout = ease_io((t - (t1 - 0.18)) / 0.18)
                paste_alpha(frame, im, (0, 336 + 30 * (1 - ein) - 14 * eout), ein * (1 - eout))
        for t0, t1, im in self.weeks:
            if t0 <= t <= t1:
                o = ease_out((t - t0) / 0.2) * (1 - ease_io((t - (t1 - 0.12)) / 0.12))
                paste_alpha(frame, im, (0, 548), o)
        if self.end and t >= v.end[0]:
            for i, (im, y) in enumerate(zip(self.end, (318, 446, 556))):
                e = ease_out((t - v.end[0] - 0.1 - 0.12 * i) / 0.35)
                paste_alpha(frame, im, (0, y + 26 * (1 - e)), e)

    def frame(self, t, cover=False):
        fr = self.scene(t)
        self.overlay(fr, t, cover)
        if cover:
            return fr
        arr = np.asarray(fr).astype(np.int16)
        arr += self.grain[(int(round(t * FPS)) // 2) % len(self.grain)]
        return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def encode(v: Video, out: Path):
    r = Renderer(v)
    n = int(round(v.duration * FPS))
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-shortest", "-map", "0:v", "-map", "1:a",
        "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-profile:v", "high", "-level", "4.1",
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        proc.stdin.write(r.frame(i / FPS).tobytes())
        if i % 60 == 0:
            print(f"  {v.slug}: {i}/{n}", file=sys.stderr, flush=True)
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit("ffmpeg failed")
    r.frame(v.cover_t, cover=True).save(out.with_name(out.stem + "-cover.png"), optimize=True)


# ---------------------------------------------------------------- the three videos

def free_page(key="S"):
    return Page(key, FREE_PDF, "Ukentlig Plan · smakebit", paid=False)


def paid_page(key, slug, title):
    return Page(key, PAID_DIR / f"{slug}.pdf", title, paid=True)


def video_1() -> Video:
    v = Video(
        slug="1-planlegg-studieuka-med-meg",
        duration=21.0,
        label="SØNDAG KVELD · 19:42",
        hook="Planlegg\nstudieuka med meg",
        clock=("19:42", "19:44"),
        battery=64,
        cover_t=20.0,
        cover_title="Planlegg\nstudieuka med meg",
    )
    S = v.add_page(free_page())
    v.cam(0, "S", 1.195)
    v.cam(2.5, "S", 1.32, center=(240, 330))
    v.cam(3.0, "S", 2.9, focus=(36, 92), at=(186, 1000))
    v.hold(6.5)
    v.cam(7.0, "S", 2.9, focus=(36, 220), at=(186, 1000))
    v.hold(9.5)
    v.cam(10.0, "S", 2.5, focus=(172, 197), at=(186, 1000))
    v.hold(13.5)
    v.cam(14.0, "S", 2.9, focus=(30, 346), at=(186, 1000))
    v.hold(16.5)
    v.cam(17.1, "S", 1.195)

    t = S.type(3.1, (47, 96, 157, 116), "Levere labrapport", 8.5)
    t = S.type(t + 0.15, (47, 116, 157, 135), "Les ex.phil kap. 4–6", 8.5)
    S.type(t + 0.15, (47, 136, 157, 155), "Trene 3 ganger", 8.5)

    t = S.type(7.15, (47, 224, 157, 243), "Labrapport – fredag", 8.5)
    S.type(t + 0.15, (47, 243, 157, 263), "Ex.phil kap. 4", 8.5)
    S.highlight(9.0, (48, 228, 140, 240), 0.4)

    t = S.type(10.15, (190, 197, 292, 217), "Forelesning", 8)
    t = S.type(t + 0.12, (190, 278, 292, 298), "Lesesal – kap. 4", 8)
    t = S.type(t + 0.12, (190, 359, 292, 379), "Gruppemøte", 8)
    S.type(t + 0.12, (323, 197, 425, 217), "Trening", 8)

    t = S.type(14.1, (49, 350, 157, 370), "Handle mat", 8.5)
    S.type(t + 0.12, (49, 370, 157, 390), "Svare veileder", 8.5)
    S.tick(15.75, (36, 356, 45, 366))
    S.tick(16.1, (36, 376, 45, 386))

    v.steps = [
        (2.5, 6.5, 1, "", "Tre mål for uka"),
        (6.5, 9.5, 2, "", "Ranger det viktigste"),
        (9.5, 13.5, 3, "", "Faste avtaler først"),
        (13.5, 17.0, 4, "", "Kryss av underveis"),
    ]
    v.end = (17.0, "Prøv smakebiten gratis", "studentplanlegger.no/gratis", "Mandag–onsdag · fyllbar PDF · hele uka 39 kr")
    return v


def video_2() -> Video:
    v = Video(
        slug="2-seks-uker-til-eksamen",
        duration=22.5,
        label="EKSAMENSPERIODE",
        hook="6 uker\ntil eksamen?",
        hook_sub="Sånn deler jeg opp lesingen",
        clock=("21:05", "21:08"),
        battery=48,
        cover_t=15.9,
        cover_title="6 uker\ntil eksamen",
    )
    S = v.add_page(free_page())
    VT = v.add_page(paid_page("VT", "vane-tracker", "Vane Tracker"))
    TD = v.add_page(paid_page("TD", "30-dagers-utfordring", "30-dagers utfordring"))
    DG = v.add_page(paid_page("DG", "daglig-gjennomgang", "Daglig Gjennomgang"))

    v.cam(0, "S", 1.6, focus=(20, 40), at=(150, 800))
    v.cam(2.5, "S", 1.72, focus=(20, 40), at=(150, 800))
    v.cam(3.0, "S", 2.9, focus=(36, 92), at=(186, 1000))
    v.hold(7.0)
    v.cam(7.4, "VT", 2.6, focus=(30, 105), at=(170, 1000))
    v.hold(11.5)
    v.cam(11.9, "TD", 1.95, focus=(36, 91), at=(190, 960))
    v.hold(13.5)
    v.cam(14.0, "TD", 1.95, center=(312.5, 0))
    v.hold(16.0)
    v.cam(16.4, "DG", 2.4, focus=(36, 100), at=(170, 960))
    v.hold(19.0)
    v.cam(19.4, "S", 1.195)

    t = S.type(3.1, (47, 96, 157, 116), "Lag pensumliste", 8.5)
    t = S.type(t + 0.15, (47, 116, 157, 135), "Del opp i 12 økter", 8.5)
    S.type(t + 0.15, (47, 136, 157, 155), "Book grupperom", 8.5)
    S.tick(6.2, (35.5, 101, 45.5, 111))

    t = VT.type(7.55, (36, 117, 163, 142), "Lese 2 timer", 9)
    t = VT.type(t + 0.15, (36, 143, 163, 168), "Sammendrag", 9)
    VT.type(t + 0.15, (36, 168, 163, 194), "Gå tur", 9)
    xs = [166, 184, 203, 221, 239, 258, 276]
    beat = 9.5
    for row_y, days in ((127, 5), (152, 3)):
        for i in range(days):
            VT.tick(beat, (xs[i] + 1, row_y + 1, xs[i] + 14, row_y + 14), 0.18)
            beat += 0.25

    TD.type(12.0, (36, 91, 560, 148), "1 gammel eksamen hver dag", 12)
    for i, x in enumerate([113, 173, 234, 294, 355, 415, 476]):
        TD.fill(14.0 + i * 0.25, (x + 2, 222, x + 34, 258), 0.18)

    t = DG.type(16.55, (56, 130, 206, 163), "Repeterte alt", 9.5)
    DG.type(t + 0.15, (233, 130, 383, 163), "Sov 8 timer", 9.5)
    DG.tick(18.15, (39, 140, 53, 153), 0.25)
    DG.tick(18.5, (213, 140, 226, 153), 0.25)

    v.steps = [
        (2.5, 7.0, None, "UKE 6–5", "Få oversikt"),
        (7.0, 11.5, None, "UKE 4–3", "Les og oppsummer"),
        (11.5, 16.0, None, "UKE 2", "Gamle eksamener"),
        (16.0, 19.0, None, "UKE 1", "Repeter og sov"),
    ]
    v.weeks = [(2.5, 7.0, {0, 1}), (7.0, 11.5, {2, 3}), (11.5, 16.0, {4}), (16.0, 19.0, {5})]
    v.end = (19.0, "Lagre til eksamensperioden", "studentplanlegger.no", "39 kr per planlegger · 5 valgfrie for 99 kr")
    return v


def video_3() -> Video:
    v = Video(
        slug="3-morgenplanen-min",
        duration=19.0,
        label="MORGENRUTINE · 07:12",
        hook="Morgenplanen min\ntar 5 minutter",
        clock=("07:12", "07:17"),
        battery=91,
        cover_t=15.4,
        cover_title="Morgenplanen\nmin",
    )
    DP = v.add_page(paid_page("DP", "daglig-planlegger", "Daglig Planlegger"))
    v.cam(0, "DP", 1.9, center=(0, 0))
    v.cam(2.5, "DP", 1.95, center=(0, 0))
    v.cam(3.0, "DP", 2.7, focus=(46, 145), at=(186, 1000))
    v.hold(5.5)
    v.cam(6.0, "DP", 2.7, focus=(342, 140), at=(186, 1000))
    v.hold(9.0)
    v.cam(9.5, "DP", 2.3, focus=(30, 335), at=(180, 960))
    v.hold(12.5)
    v.cam(13.0, "DP", 2.7, focus=(324, 596), at=(250, 1050))
    v.hold(15.5)
    v.cam(16.1, "DP", 1.9, center=(0, 0))

    DP.type(3.1, (73, 145, 292, 164), "Ferdig med innledningen", 10)
    DP.highlight(4.65, (74, 148, 214, 161), 0.4)

    t = DP.type(6.1, (361, 140, 569, 159), "Skrive 2 sider", 10)
    t = DP.type(t + 0.12, (361, 166, 569, 185), "Forelesning 10.15", 10)
    DP.type(t + 0.12, (361, 191, 569, 210), "Handle middag", 10)

    t = DP.type(9.6, (73, 340, 306, 368), "Lesesal", 10)
    t = DP.type(t + 0.12, (73, 396, 306, 424), "Forelesning", 10)
    t = DP.type(t + 0.12, (73, 452, 306, 480), "Lunsj + tur", 10)
    DP.type(t + 0.12, (73, 508, 306, 536), "Skrive", 10)

    for i, x in enumerate([449, 471, 493]):
        DP.fill(13.2 + i * 0.4, (x + 4, 600, x + 19, 617), 0.28, color=(205, 224, 236))
    DP.ring(14.5, (348, 596, 372, 620), 0.45)

    v.steps = [
        (2.5, 5.5, 1, "", "Ett mål for dagen"),
        (5.5, 9.0, 2, "", "Tre prioriteter"),
        (9.0, 12.5, 3, "", "Blokker tiden"),
        (12.5, 15.5, 4, "", "Vann og humør"),
    ]
    v.end = (15.5, "Daglig Planlegger", "studentplanlegger.no", "Fyllbar PDF · 39 kr · gratis smakebit på /gratis")
    return v


VIDEOS = {"1": video_1, "2": video_2, "3": video_3}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="1,2,3")
    ap.add_argument("--preview", default="", help="comma-separated times; writes PNG stills instead of video")
    args = ap.parse_args()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for key in args.only.split(","):
        v = VIDEOS[key]()
        if args.preview:
            r = Renderer(v)
            for ts in args.preview.split(","):
                tt = float(ts)
                r.frame(tt).save(OUT_DIR / f"preview-{v.slug}-{tt:05.2f}.png")
            r.frame(v.cover_t, cover=True).save(OUT_DIR / f"preview-{v.slug}-cover.png")
            continue
        encode(v, OUT_DIR / f"{v.slug}.mp4")
        print(f"wrote {OUT_DIR / (v.slug + '.mp4')}")


if __name__ == "__main__":
    main()
