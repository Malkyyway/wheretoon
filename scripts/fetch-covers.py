#!/usr/bin/env python3
"""Fetch official cover art for every WhereToon title and self-host it.

Reads the official "Baca di" links from src/data/titles.ts, extracts the
og:image from each title page's raw HTML, downloads the cover and saves it
as public/covers/<slug>.jpg.

Platform rules (verified 25 Nov 2026):
- WEBTOON (EN preferred, ID fallback): og:image is a 480x540 crop
  (?type=crop540_540). Strip the query string to get the portrait 480x623.
- Tappytoon: og:image is 250x250; append ?size=large for 300x300.
- Manta: og:image as-is (720x720 square).

Re-run anytime to refresh covers (e.g. after a platform re-uploads art):
    python3 scripts/fetch-covers.py            # only fetch missing/invalid
    python3 scripts/fetch-covers.py --force    # re-download everything

Writes a JSON report to scripts/covers-report.json.
"""

import argparse
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TITLES_TS = ROOT / "src" / "data" / "titles.ts"
COVERS_DIR = ROOT / "public" / "covers"
REPORT_PATH = Path(__file__).resolve().parent / "covers-report.json"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)

SESSION = requests.Session()
SESSION.headers.update(
    {"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"}
)


def parse_titles(path: Path):
    """Extract (slug, [(platform, url), ...]) per title from titles.ts.

    Links are built with the WEBTOON_EN/WEBTOON_ID/TAPPYTOON/MANTA helpers
    or inline objects; resolve them to full URLs here.
    """
    src = path.read_text(encoding="utf-8")
    # Split into per-title blocks: each starts with `id: "...",`
    blocks = re.split(r"(?m)(?=^\s+id: \")", src)
    titles = []
    for block in blocks:
        m_slug = re.search(r'slug: "([^"]+)"', block)
        if not m_slug:
            continue
        slug = m_slug.group(1)
        links = []
        for m in re.finditer(r'WEBTOON_EN\("([^"]+)"\)', block):
            links.append(("WEBTOON", f"https://www.webtoons.com/en/{m.group(1)}"))
        for m in re.finditer(r'WEBTOON_ID\("([^"]+)"\)', block):
            links.append(("WEBTOON", f"https://www.webtoons.com/id/{m.group(1)}"))
        for m in re.finditer(r'TAPPYTOON\("([^"]+)"\)', block):
            links.append(("Tappytoon", f"https://www.tappytoon.com/en/book/{m.group(1)}"))
        for m in re.finditer(r'MANTA\("([^"]+)",\s*(\d+)\)', block):
            links.append(
                ("Manta", f"https://manta.net/en/series/{m.group(1)}?seriesId={m.group(2)}")
            )
        # Inline link objects (used by solo-leveling / lout-of-counts-family)
        for m in re.finditer(
            r'platform:\s*"(Tappytoon|Manta|WEBTOON)",\s*\n\s*url:\s*"([^"]+)"', block
        ):
            url = m.group(2)
            if url not in [u for _, u in links]:
                links.append((m.group(1), url))
        if links:
            titles.append((slug, links))
    return titles


def prefer_link(links):
    """WEBTOON EN first, then WEBTOON ID, then any other link."""
    def rank(item):
        platform, url = item
        if platform == "WEBTOON" and "/en/" in url:
            return 0
        if platform == "WEBTOON":
            return 1
        return 2

    return sorted(links, key=rank)


def extract_og_image(page_html: str):
    """Return the og:image URL from raw HTML, or None."""
    patterns = [
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
    ]
    for pat in patterns:
        m = re.search(pat, page_html, re.IGNORECASE)
        if m:
            return html_lib.unescape(m.group(1)).strip()
    return None


def transform_cover_url(img_url: str, platform: str) -> str:
    if platform == "WEBTOON":
        # Strip ?type=crop540_540 -> portrait 480x623 (crop540_720/405 404).
        return img_url.split("?")[0]
    if platform == "Tappytoon":
        # 250x250 -> 300x300.
        return img_url if "?" in img_url else img_url + "?size=large"
    return img_url  # Manta: as-is


def verify_jpeg(path: Path):
    """Return (width, height, bytes) if path is a readable JPEG, else None."""
    try:
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            if im.format != "JPEG":
                return None
            return im.size[0], im.size[1], path.stat().st_size
    except Exception:
        return None


def fetch_one(slug: str, links, force: bool):
    """Fetch one cover. Returns dict with outcome details."""
    out_path = COVERS_DIR / f"{slug}.jpg"
    if not force and out_path.exists():
        ok = verify_jpeg(out_path)
        if ok:
            return {"slug": slug, "status": "cached", "path": str(out_path),
                    "width": ok[0], "height": ok[1], "bytes": ok[2]}
    tried = []
    for platform, page_url in prefer_link(links):
        try:
            resp = SESSION.get(page_url, timeout=20)
            resp.raise_for_status()
        except Exception as exc:  # noqa: BLE001 - report and try next link
            tried.append(f"{page_url}: page fetch failed ({exc})")
            continue
        og = extract_og_image(resp.text)
        if not og:
            tried.append(f"{page_url}: no og:image in HTML")
            continue
        cover_url = transform_cover_url(og, platform)
        try:
            img_resp = SESSION.get(
                cover_url, timeout=30, headers={"Referer": page_url}
            )
            img_resp.raise_for_status()
        except Exception as exc:  # noqa: BLE001
            tried.append(f"{cover_url}: image fetch failed ({exc})")
            continue
        ctype = img_resp.headers.get("content-type", "")
        # Tappytoon's CDN returns the bare value "image" (no subtype) for
        # some files; the PIL check below is the real gate, so accept it.
        if not (ctype.startswith("image/") or ctype == "image"):
            tried.append(f"{cover_url}: content-type {ctype!r} is not an image")
            continue
        try:
            tmp = COVERS_DIR / f".{slug}.tmp"
            tmp.write_bytes(img_resp.content)
            with Image.open(tmp) as im:
                im.load()
                rgb = im.convert("RGB")
                w, h = rgb.size
                if w < 200 or h < 200:
                    raise ValueError(f"image too small: {w}x{h}")
                rgb.save(out_path, "JPEG", quality=88)
            tmp.unlink(missing_ok=True)
        except Exception as exc:  # noqa: BLE001
            tried.append(f"{cover_url}: invalid image ({exc})")
            continue
        return {"slug": slug, "status": "downloaded", "path": str(out_path),
                "width": w, "height": h, "bytes": out_path.stat().st_size,
                "platform": platform, "source": cover_url}
    return {"slug": slug, "status": "failed", "tried": tried}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true",
                        help="re-download every cover")
    parser.add_argument("--only", default="",
                        help="comma-separated slugs to fetch (default: all)")
    args = parser.parse_args()

    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    titles = parse_titles(TITLES_TS)
    if args.only:
        wanted = {s.strip() for s in args.only.split(",") if s.strip()}
        titles = [(s, l) for s, l in titles if s in wanted]
    print(f"{len(titles)} titles to process")

    results = []
    for i, (slug, links) in enumerate(titles, 1):
        result = fetch_one(slug, links, args.force)
        platform = next((p for p, _ in prefer_link(links)), "?")
        result.setdefault("platform", platform)
        results.append(result)
        status = result["status"]
        extra = ""
        if status in ("downloaded", "cached"):
            extra = f" {result['width']}x{result['height']} {result['bytes']/1024:.0f} KB"
        print(f"[{i}/{len(titles)}] {slug} ({result['platform']}): {status}{extra}")
        if i < len(titles):
            time.sleep(0.4)

    ok = [r for r in results if r["status"] in ("downloaded", "cached")]
    failed = [r for r in results if r["status"] == "failed"]
    total_bytes = sum(r.get("bytes", 0) for r in ok)
    by_platform = {}
    for r in ok:
        by_platform[r["platform"]] = by_platform.get(r["platform"], 0) + 1

    print(f"\nOK: {len(ok)}/{len(results)}  ({by_platform})  "
          f"total {total_bytes/1024/1024:.2f} MB")
    if failed:
        print(f"FAILED ({len(failed)}):")
        for r in failed:
            print(f"  - {r['slug']} ({r['platform']}):")
            for t in r["tried"]:
                print(f"      {t}")

    REPORT_PATH.write_text(
        json.dumps({"results": results, "ok": len(ok),
                    "failed": [r["slug"] for r in failed],
                    "total_bytes": total_bytes}, indent=2),
        encoding="utf-8",
    )
    print(f"Report: {REPORT_PATH}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
