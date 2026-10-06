#!/usr/bin/env python3
"""Revider og bygg produktbildene i public/images/products/ fra side 1 av PDF-ene.

Bruk:
    python3 scripts/build-product-thumbnails.py --audit
    python3 scripts/build-product-thumbnails.py aarlig-planlegger daglig-timeplan ...

--audit sammenligner hvert produktbilde fra lib/products.ts med side 1 av alle
planleggerne og flagger bilder som ligner mer på en annen PDF enn sin egen.

Bildene bygges med samme oppsett som de eksisterende: pdftoppm (poppler) på
200 dpi uten kantutjevning av vektorgrafikk (gir de skarpe 2 px-linjene), lagret
som JPEG med de samme kvantiseringstabellene, 4:2:0 og «Display»-ICC-profilen
fra det eksisterende bildet. Rettede PDF-er i assets/source/fixed/ brukes foran
originalene i assets/source/.
"""

from __future__ import annotations

import argparse
import io
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageCms

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_TS = ROOT / "lib" / "products.ts"
THUMBS = ROOT / "public" / "images" / "products"
STYLE_REFERENCE = THUMBS / "handlingsplan.jpg"
DPI = 200


def product_images() -> dict[str, str]:
    text = PRODUCTS_TS.read_text(encoding="utf-8")
    pairs = re.findall(r'id: "([^"]+)",.*?image: "([^"]+)"', text, re.S)
    return {pid: image for pid, image in pairs if not image.startswith("/")}


def source_pdf(source: Path, slug: str) -> Path:
    fixed = source / "fixed" / f"{slug}.pdf"
    return fixed if fixed.exists() else source / f"{slug}.pdf"


def render_page1(pdf: Path) -> Image.Image:
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "page"
        subprocess.run(
            ["pdftoppm", "-r", str(DPI), "-f", "1", "-l", "1", "-singlefile", "-aaVector", "no", "-png", str(pdf), str(out)],
            check=True,
        )
        return Image.open(f"{out}.png").convert("RGB")


def signature(im: Image.Image) -> np.ndarray:
    a = np.asarray(im.convert("L").resize((120, 170), Image.BILINEAR), dtype=float)
    a -= a.mean()
    return a / (np.linalg.norm(a) or 1)


def audit(source: Path) -> int:
    images = product_images()
    pages = {slug: signature(render_page1(source_pdf(source, slug))) for slug in images}
    bad = 0
    for slug, image in images.items():
        thumb = signature(Image.open(THUMBS / image))
        scores = sorted(((float((thumb * sig).sum()), other) for other, sig in pages.items()), reverse=True)
        own = next(s for s, other in scores if other == slug)
        best_score, best = scores[0]
        ok = best == slug
        bad += not ok
        status = "OK " if ok else "FEIL"
        detail = "" if ok else f" -> viser {best} ({best_score:.3f})"
        print(f"{status} {image:34} egen {own:.3f}{detail}")
    print(f"{bad} av {len(images)} bilder viser feil planlegger")
    return bad


def save_thumbnail(im: Image.Image, target: Path) -> None:
    template = Image.open(target if target.exists() else STYLE_REFERENCE)
    reference = Image.open(STYLE_REFERENCE)
    icc = reference.info["icc_profile"]
    if template.mode == "L":
        im.convert("L").save(target, "JPEG", qtables=reference.quantization, dpi=(DPI, DPI))
        return
    display = ImageCms.ImageCmsProfile(io.BytesIO(icc))
    srgb = ImageCms.createProfile("sRGB")
    im = ImageCms.profileToProfile(im, srgb, display, outputMode="RGB")
    im.save(target, "JPEG", qtables=reference.quantization, subsampling=2, icc_profile=icc, dpi=(DPI, DPI))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slugs", nargs="*", help="produkt-id-er som skal bygges på nytt")
    parser.add_argument("--audit", action="store_true", help="sjekk alle bilder mot PDF-ene")
    parser.add_argument("--source", type=Path, default=ROOT / "assets" / "source")
    args = parser.parse_args()

    images = product_images()
    for slug in args.slugs:
        if slug not in images:
            raise SystemExit(f"ukjent produkt: {slug}")
        pdf = source_pdf(args.source, slug)
        target = THUMBS / images[slug]
        save_thumbnail(render_page1(pdf), target)
        print(f"{target.relative_to(ROOT)} <- {pdf.relative_to(ROOT)} side 1")

    if args.audit:
        return 1 if audit(args.source) else 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
