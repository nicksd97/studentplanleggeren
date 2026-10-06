#!/usr/bin/env python3
"""Rebuild site images that showed dated (2023/2024) calendar pages.

Both images now show real, undated pages from the delivered planner PDFs:

- public/images/marketing/3.png (front page, "Årlig, månedlig, ukentlig og
  daglig" card): Årsplan, Månedlig Plan, Ukentlig Plan and Daglig Planlegger.
- public/images/brand/Front page cover photo rev.2.png (hero): the "2023"
  year-calendar page, which is not part of any planner, is replaced in place
  by page 1 of Ukentlig Plan. The patch always starts from the original hero
  in git (HERO_BASE_COMMIT), so re-running gives the same file.

The paid PDFs are never committed (the repo is public). Put them in the
git-ignored assets/source/ folder as <slug>.pdf, then:

    pip install pymupdf pillow numpy
    python3 scripts/build-site-images.py
"""

from __future__ import annotations

import argparse
import io
import math
import subprocess
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "assets" / "lead-magnet" / "fonts"
MARKETING_OUT = ROOT / "public" / "images" / "marketing" / "3.png"
HERO = ROOT / "public" / "images" / "brand" / "Front page cover photo rev.2.png"
HERO_BASE_COMMIT = "8c24f4e43397183f1625d89c9b0553c3d89ba49e"


def render_page(source: Path, slug: str, page: int, width: int) -> Image.Image:
    doc = pymupdf.open(source / f"{slug}.pdf")
    p = doc[page]
    zoom = width / p.rect.width
    pix = p.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
    return Image.frombytes("RGB", (pix.w, pix.h), pix.samples)


def mauve_background(size: tuple[int, int]) -> Image.Image:
    # Radial vignette sampled from the previous card: centre (245,234,232),
    # corners (181,175,175).
    w, h = size
    y, x = np.mgrid[0:h, 0:w]
    r = np.sqrt(((x - w * 0.5) / (w * 0.5)) ** 2 + ((y - h * 0.5) / (h * 0.5)) ** 2) / math.sqrt(2)
    t = np.clip(r, 0, 1)[..., None] ** 1.6
    centre = np.array([245, 234, 232], dtype=float)
    corner = np.array([181, 175, 175], dtype=float)
    return Image.fromarray((centre * (1 - t) + corner * t).astype(np.uint8), "RGB")


def paste_with_shadow(canvas: Image.Image, page: Image.Image, xy: tuple[int, int]) -> None:
    x, y = xy
    shadow = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(shadow).rectangle(
        [x + 4, y + 8, x + page.width + 4, y + page.height + 8], fill=110
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(9))
    canvas.paste(Image.new("RGB", canvas.size, (90, 78, 80)), (0, 0), shadow)
    canvas.paste(page, (x, y))


def build_marketing_card(source: Path) -> None:
    w, h = 1588, 1191
    canvas = mauve_background((w, h))
    box_w, box_h = 370, 478
    pages = [
        ("aarlig-planlegger", 0, (85, 92)),
        ("maanedlig-planlegger", 0, (515, 92)),
        ("ukentlig-plan", 0, (85, 630)),
        ("daglig-planlegger", 0, (515, 630)),
    ]
    for slug, index, (x, y) in pages:
        img = render_page(source, slug, index, box_w * 3)
        img.thumbnail((box_w, box_h), Image.LANCZOS)
        paste_with_shadow(canvas, img, (x + (box_w - img.width) // 2, y + (box_h - img.height) // 2))

    draw = ImageDraw.Draw(canvas)
    heading = ImageFont.truetype(str(FONT_DIR / "Montserrat-SemiBold.ttf"), 64)
    item = ImageFont.truetype(str(FONT_DIR / "Montserrat-Medium.ttf"), 40)
    text_x = 1010
    for dx, dy, fill in ((3, 3, (150, 140, 140)), (0, 0, (58, 54, 56))):
        draw.text((text_x + dx, 150 + dy), "Alle", font=heading, fill=fill)
        draw.text((text_x + dx, 228 + dy), "SIDER", font=heading, fill=fill)
    for i, label in enumerate(["Årsplan", "Månedlig plan", "Ukentlig plan", "Daglig plan"]):
        draw.text((text_x, 700 + i * 70), f"· {label}", font=item, fill=(58, 54, 56))

    canvas.save(MARKETING_OUT, optimize=True)
    print(f"Wrote {MARKETING_OUT.relative_to(ROOT)}")


# Hero geometry, measured on the 1320×972 hero: the dated page's top-left
# corner, its rotation, and the edges of the pages lying on top of it.
HERO_SIZE = (1320, 972)
PAGE_ORIGIN = (201.5, 188.5)
PAGE_ANGLE = math.radians(2.1)
PAGE_WIDTH = 217.0
JULI_EDGE = ((381.0, 182.0), (388.4, 454.0))
DAGELIG_TOP = ((364.0, 455.3), (388.4, 454.4))
DAGELIG_LEFT = ((364.0, 455.3), (364.0, 468.2))
DAGLIG_TOP = ((364.0, 468.2), (211.9, 473.7))
# Drop-shadow profile those pages cast, sampled on the hero (edge → inward).
SHADOW = [119, 132, 162, 192, 213, 231, 242, 247, 252, 253]


def segment_distance(px: np.ndarray, py: np.ndarray, a, b) -> np.ndarray:
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    t = np.clip(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1)
    return np.hypot(px - (ax + t * dx), py - (ay + t * dy))


def patch_hero(source: Path) -> None:
    original = subprocess.run(
        ["git", "show", f"{HERO_BASE_COMMIT}:{HERO.relative_to(ROOT).as_posix()}"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    ).stdout
    hero = Image.open(io.BytesIO(original)).convert("RGB")
    if hero.size != HERO_SIZE:
        raise SystemExit(f"unexpected hero size {hero.size}; re-measure the geometry")

    scale = 4
    page = render_page(source, "ukentlig-plan", 0, int(PAGE_WIDTH * scale))
    cos, sin = math.cos(PAGE_ANGLE), math.sin(PAGE_ANGLE)
    x0, y0 = PAGE_ORIGIN
    # Rotate at 4× (output pixel → page pixel), then downsample so thin
    # lines are averaged instead of aliased.
    ox, oy = x0 * scale, y0 * scale
    affine = (cos, -sin, -(ox * cos - oy * sin), sin, cos, -(ox * sin + oy * cos))
    big = (hero.width * scale, hero.height * scale)
    layer = page.transform(big, Image.AFFINE, affine, Image.BICUBIC, fillcolor=(255, 255, 255))
    layer = layer.resize(hero.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.35))

    inset = 1.5
    top_left = (x0 + inset * (cos + sin), y0 + inset * (cos - sin))
    polygon = [
        top_left,
        (JULI_EDGE[0][0], JULI_EDGE[0][1] + inset),
        JULI_EDGE[1],
        DAGELIG_TOP[0],
        DAGELIG_LEFT[1],
        (DAGLIG_TOP[1][0] + inset, DAGLIG_TOP[1][1]),
    ]
    ss = 4
    mask = Image.new("L", (hero.width * ss, hero.height * ss), 0)
    ImageDraw.Draw(mask).polygon([(x * ss, y * ss) for x, y in polygon], fill=255)
    mask = mask.resize(hero.size, Image.LANCZOS)

    py, px = np.mgrid[0 : hero.height, 0 : hero.width].astype(float)
    dist = np.minimum.reduce(
        [segment_distance(px, py, *edge) for edge in (JULI_EDGE, DAGELIG_TOP, DAGLIG_TOP)]
    )
    profile = np.array(SHADOW + [255], dtype=float) / 255
    shade = np.interp(dist, np.arange(len(profile)), profile)
    shaded = (np.asarray(layer, dtype=float) * shade[..., None]).clip(0, 255).astype(np.uint8)

    hero.paste(Image.fromarray(shaded, "RGB"), (0, 0), mask)
    hero.save(HERO, optimize=True)
    print(f"Wrote {HERO.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source", type=Path, default=ROOT / "assets" / "source")
    args = parser.parse_args()
    build_marketing_card(args.source)
    patch_hero(args.source)


if __name__ == "__main__":
    main()
