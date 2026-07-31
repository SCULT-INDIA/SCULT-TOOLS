"""
Generate the favicon set from the official Scult mark.

Run from the repo root:  python scripts/make-favicon.py
Requires Pillow:         pip install pillow

`scult-mark-source.png` is the official 1024x1024 mark in the parent brand's acid
lime on black. The tools hub uses the violet/white palette, so the mark is
recoloured to violet-600 (#631AFF — the same violet as the header wordmark) on a
white disc. Recolouring the real asset keeps the geometry exact; redrawing the
shapes by hand would be subtly wrong in a way that shows next to the parent site.

Outputs (App Router file conventions, so Next emits the <link> tags itself):
  app/favicon.ico      16/32/48/64
  app/icon.png         512
  app/apple-icon.png   180, flattened on white
"""

import os

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "scult-mark-source.png")
APP = os.path.normpath(os.path.join(HERE, "..", "app"))

VIOLET = (99, 26, 255)  # --color-violet-600
SUPERSAMPLE = 4  # render large, downsample once, for clean edges
MARK_FRACTION = 0.66  # mark size as a fraction of the disc diameter


def load_mark() -> Image.Image:
    """Return the mark as an alpha mask, cropped to its bounding box."""
    src = Image.open(SRC).convert("RGB")
    w, h = src.size
    px = src.load()

    mask = Image.new("L", (w, h), 0)
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            _r, g, _b = px[x, y]
            # Lime is (167,255,26), background ~(10,10,10). Scaling the green
            # channel keeps the anti-aliased rim graded rather than binary, so
            # downsampled edges stay smooth.
            mpx[x, y] = max(0, min(255, int((g - 40) * 1.6)))

    bbox = mask.point(lambda v: 255 if v > 40 else 0).getbbox()
    if bbox is None:
        raise SystemExit(f"could not locate the mark in {SRC}")
    return mask.crop(bbox)


def build(mark: Image.Image, size: int) -> Image.Image:
    """Violet mark on a white disc, with transparent corners."""
    mw, mh = mark.size
    s = size * SUPERSAMPLE

    disc = Image.new("L", (s, s), 0)
    ImageDraw.Draw(disc).ellipse((0, 0, s - 1, s - 1), fill=255)
    white = Image.new("RGBA", (s, s), (255, 255, 255, 255))
    canvas = Image.composite(white, Image.new("RGBA", (s, s), (0, 0, 0, 0)), disc)

    scale = (s * MARK_FRACTION) / max(mw, mh)
    nw, nh = max(1, int(mw * scale)), max(1, int(mh * scale))
    resized = mark.resize((nw, nh), Image.LANCZOS)

    layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    layer.paste(
        Image.new("RGBA", (nw, nh), (*VIOLET, 255)),
        ((s - nw) // 2, (s - nh) // 2),
        resized,
    )

    return Image.alpha_composite(canvas, layer).resize((size, size), Image.LANCZOS)


def main() -> None:
    mark = load_mark()
    print(f"mark mask: {mark.size[0]}x{mark.size[1]}")

    build(mark, 512).save(os.path.join(APP, "icon.png"), optimize=True)
    print("wrote app/icon.png (512)")

    apple = build(mark, 180)
    # Apple touch icons ignore transparency and get composited on an unknown
    # colour, so flatten on white deliberately rather than leaving it to the OS.
    flat = Image.new("RGB", apple.size, (255, 255, 255))
    flat.paste(apple, (0, 0), apple)
    flat.save(os.path.join(APP, "apple-icon.png"), optimize=True)
    print("wrote app/apple-icon.png (180)")

    # Each .ico frame is rendered at its own size rather than downscaled from
    # 512 — 16px is the size that actually has to stay legible.
    sizes = [16, 32, 48, 64]
    frames = [build(mark, s) for s in sizes]
    frames[0].save(
        os.path.join(APP, "favicon.ico"),
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[1:],
    )
    print(f"wrote app/favicon.ico {sizes}")


if __name__ == "__main__":
    main()
