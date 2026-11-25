#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
from datetime import datetime, timezone

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
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
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
        try:
            res = curl_requests.get(
                url,
                headers=HEADERS,
                cookies=cookies,
                impersonate="chrome",
                timeout=30,
            )
        except Exception as error:
            raise RuntimeError(
                f"THM connection failed on page {page}: {error}"
            ) from error
        if res.status_code in (401, 403):
            raise RuntimeError("THM session is invalid or expired.")

        if not res.ok:
            raise RuntimeError(
                f"THM request failed with HTTP {res.status_code}."
            )

        try:
            data = res.json()
            pagination = data["data"]
            docs = pagination["docs"]
            total_pages = pagination["totalPages"]

            if not isinstance(docs, list) or not isinstance(total_pages, int):
                raise ValueError("Unexpected THM response structure.")

        except (ValueError, KeyError, TypeError) as error:
            raise RuntimeError(
                f"Unable to process THM response on page {page}: {error}"
            ) from error

        all_docs.extend(docs)
        page += 1

    SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
    if all_docs:
        (SAMPLE_DIR / "thm.json").write_text(json.dumps(all_docs[0], indent=2, ensure_ascii=False),encoding="utf-8",)

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
        "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
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
    OUTPUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False),encoding="utf-8",)
    print(f"THM: {len(all_docs)} rooms saved.")
    print(f"Sample saved to .data/thm.json")

if __name__ == "__main__":
    try:
        main()
    except RuntimeError as error:
        print(f"ERROR: {error}")

        if str(error) == "THM session is invalid or expired.":
            sys.exit(2)

        sys.exit(1)
    except Exception as error:
        print(f"ERROR: {error}")
        sys.exit(1)