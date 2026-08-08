#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

try:
    from curl_cffi import requests as curl_requests
except ImportError:
    print("ERROR: curl_cffi not installed. Run: pip install curl_cffi", file=sys.stderr)
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

THM_COOKIES = os.environ.get("THM_COOKIES", "")
if not THM_COOKIES:
    print("ERROR: THM_COOKIES not set in .env", file=sys.stderr)
    sys.exit(1)

OUTPUT_PATH  = Path(__file__).parent.parent / "src" / "data" / "rooms.json"
SAMPLE_DIR   = Path(__file__).parent.parent / ".data"
BASE_URL     = "https://tryhackme.com/api/v2"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7,es-AR;q=0.6",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "sec-ch-ua": '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Priority": "u=0, i",
    "Connection": "keep-alive",
    "Cookie": THM_COOKIES,
}

def parse_cookies(cookie_str):
    cookies = {}
    for part in cookie_str.split(";"):
        part = part.strip()
        if "=" in part:
            k, v = part.split("=", 1)
            cookies[k.strip()] = v.strip()
    return cookies

def main():
    cookies = parse_cookies(THM_COOKIES)
    page = 1
    all_docs = []
    total_pages = 1

    while page <= total_pages:
        url = f"{BASE_URL}/rooms/my-rooms?page={page}&limit=200"
        res = curl_requests.get(
            url,
            headers=HEADERS,
            cookies=cookies,
            impersonate="chrome",
            timeout=30,
        )
        if res.status_code != 200:
            body = res.text[:300]
            print(f"ERROR: status {res.status_code} on page {page} — {body}", file=sys.stderr)
            sys.exit(1)

        data = res.json()
        all_docs.extend(data["data"]["docs"])
        total_pages = data["data"]["totalPages"]
        page += 1

    SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
    if all_docs:
        (SAMPLE_DIR / "thm.json").write_text(json.dumps(all_docs[0], indent=2, ensure_ascii=False))

    completed    = [r for r in all_docs if r.get("userCompleted")]
    by_difficulty = {}
    by_type       = {}
    for r in completed:
        d = r.get("difficulty", "unknown")
        t = r.get("type", "unknown")
        by_difficulty[d] = by_difficulty.get(d, 0) + 1
        by_type[t]       = by_type.get(t, 0) + 1

    total = len(all_docs)
    pct   = round((len(completed) / total) * 100, 1) if total > 0 else 0

    output = {
        "last_updated": __import__("datetime").datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
        "statistics": {
            "total_rooms": total,
            "completed": len(completed),
            "completion_percentage": pct,
            "by_difficulty": by_difficulty,
            "by_type": by_type,
        },
        "rooms": [
            {
                "id":          r.get("_id"),
                "title":       r.get("title"),
                "code":        r.get("code"),
                "description": r.get("description"),
                "difficulty":  r.get("difficulty"),
                "type":        r.get("type"),
                "completed":   r.get("userCompleted", False),
                "tags":        [t.get("tagLabel") for t in r.get("tagEntities", [])],
                "imageURL":    r.get("imageURL"),
            }
            for r in all_docs
        ],
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"✅ THM: {len(all_docs)} rooms saved.")
    print(f"   📄 Sample saved to .data/thm.json")

if __name__ == "__main__":
    main()