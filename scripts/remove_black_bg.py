#!/usr/bin/env python3
"""
remove_black_bg.py — converteix fons negre uniforme a transparent.

Tècnica: luminance-as-alpha amb unpremultiply.
  alpha = max(R, G, B) després d'una corba de threshold suau
  R,G,B → escalats per recuperar el color original (straight alpha)

Això preserva bigotis blancs i vores fines (que tenen un canal clar) i
descarta píxels purament foscos. Molt més net que un fuzz threshold pla.

Ús:
    python3 scripts/remove_black_bg.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IN_DIR = ROOT / "public" / "mascot"
BACKUP_DIR = ROOT / "scripts" / "_orig-mascot"

POSES = ["idle", "parlant", "content", "espantat", "ballant", "pensant"]

# Llindars
NEAR_BLACK = 18   # tot el que té max(RGB) <= NEAR_BLACK queda totalment transparent
SOFT_EDGE  = 50   # entre NEAR_BLACK i SOFT_EDGE: alpha gradual, sense desmultiplicar (anti-halo)


def remove_black(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = pixels[x, y]
            mx = max(r, g, b)
            if mx <= NEAR_BLACK:
                pixels[x, y] = (0, 0, 0, 0)
            elif mx < SOFT_EDGE:
                # vora suau: alpha proporcional, color tal qual (sense unpremultiply
                # per evitar halo cromàtic)
                a = int((mx - NEAR_BLACK) / (SOFT_EDGE - NEAR_BLACK) * 255)
                pixels[x, y] = (r, g, b, a)
            else:
                # interior del subject: unpremultiply per recuperar color original
                # (perquè es vegi bé sobre fons clars, no només sobre negre)
                a = mx
                nr = min(255, int(r * 255 / a))
                ng = min(255, int(g * 255 / a))
                nb = min(255, int(b * 255 / a))
                pixels[x, y] = (nr, ng, nb, 255)
    return img


def main():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    for pose in POSES:
        src = IN_DIR / f"{pose}.png"
        backup = BACKUP_DIR / f"{pose}.png"
        if not src.exists():
            print(f"  [skip] {src} no existeix")
            continue
        if not backup.exists():
            backup.write_bytes(src.read_bytes())
            print(f"  [backup] {pose}.png → _orig/")
        img = Image.open(src)
        out = remove_black(img)
        out.save(src, optimize=True)
        before = backup.stat().st_size
        after = src.stat().st_size
        print(f"  [done]   {pose}.png  {before//1024} kB → {after//1024} kB")


if __name__ == "__main__":
    main()
