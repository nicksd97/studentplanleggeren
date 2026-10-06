#!/usr/bin/env python3
"""Build the image used in the /gratis email from the real sample PDF.

    python3 scripts/build-email-images.py

Writes public/images/email/smakebit.png: page 1 of
assets/lead-magnet/gratis-ukentlig-plan-smakebit.pdf at 2× the 280 px it is
shown at, on a transparent background with a soft shadow, so it sits on both
the light beige email and dark-mode backgrounds.
"""

from __future__ import annotations

from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "lead-magnet" / "gratis-ukentlig-plan-smakebit.pdf"
OUT = ROOT / "public" / "images" / "email" / "smakebit.png"
DISPLAY_WIDTH = 280
SCALE = 2
MARGIN = 24


def main() -> None:
    page = pymupdf.open(SOURCE)[0]
    page_w = (DISPLAY_WIDTH - 2 * MARGIN // SCALE) * SCALE
    zoom = page_w / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), annots=True)
    render = Image.frombytes("RGB", (pix.w, pix.h), pix.samples)

    size = (render.width + 2 * MARGIN, render.height + 2 * MARGIN)
    shadow = Image.new("L", size, 0)
    ImageDraw.Draw(shadow).rectangle(
        [MARGIN, MARGIN + 6, MARGIN + render.width, MARGIN + render.height + 6], fill=90
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))

    canvas = Image.new("RGBA", size, (58, 51, 48, 0))
    canvas.putalpha(shadow)
    canvas.paste(render, (MARGIN, MARGIN))
    border = ImageDraw.Draw(canvas)
    border.rectangle(
        [MARGIN, MARGIN, MARGIN + render.width - 1, MARGIN + render.height - 1],
        outline=(226, 216, 209, 255),
        width=1,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT, optimize=True)
    print(f"Wrote {OUT.relative_to(ROOT)} {size[0]}×{size[1]} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
