#!/usr/bin/env python3
"""
HTB data fetcher — exploration and data retrieval script.

Usage:
    python3 getdata/fetch_htb.py --machines
    python3 getdata/fetch_htb.py --academy
    python3 getdata/fetch_htb.py --sherlocks
    python3 getdata/fetch_htb.py --challenges
    python3 getdata/fetch_htb.py --all
    python3 getdata/fetch_htb.py --machines --challenges
"""

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: requests not installed. Run: pip install requests", file=sys.stderr)
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

ROOT_DIR   = Path(__file__).parent.parent
SAMPLE_DIR = ROOT_DIR / ".data"

HTB_TOKEN           = os.environ.get("HTB_API_TOKEN", "")
HTB_ACADEMY_SESSION = os.environ.get("HTB_ACADEMY_SESSION", "")

HTB_BASE_V5  = "https://labs.hackthebox.com/api/v5"
HTB_BASE_V4  = "https://labs.hackthebox.com/api/v4"
ACADEMY_BASE = "https://academy.hackthebox.com/api/v2"

HTB_HEADERS = {
    "Accept":        "application/json",
    "User-Agent":    "Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0",
    "Authorization": f"Bearer {HTB_TOKEN}",
    "Origin":        "https://app.hackthebox.com",
    "Referer":       "https://app.hackthebox.com/",
}

ACADEMY_HEADERS = {
    "Accept":     "application/json",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0",
    "Referer":    "https://academy.hackthebox.com/app/dashboard",
    "Cookie":     f"htb_academy_session={HTB_ACADEMY_SESSION}",
}


def save(name: str, data) -> Path:
    SAMPLE_DIR.mkdir(parents=True, exist_ok=True)

    path = SAMPLE_DIR / f"{name}.json"
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return path


def get(url: str, headers: dict, params: dict = None) -> dict:
    try:
        res = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=30,
        )
    except requests.RequestException as error:
        raise RuntimeError(f"HTB connection failed: {error}") from error

    if res.status_code in (401, 403):
        raise RuntimeError("HTB authentication failed. Check your credentials.")

    try:
        res.raise_for_status()
    except requests.HTTPError as error:
        raise RuntimeError(
            f"HTB request failed with HTTP {res.status_code}: {res.reason} — {res.url}"
        ) from error

    try:
        return res.json()
    except requests.exceptions.JSONDecodeError as error:
        raise RuntimeError(
            f"HTB returned an invalid JSON response: {res.url}"
        ) from error


def get_all_pages(url: str, headers: dict, per_page: int = 100) -> list:
    """Fetch all pages of a paginated endpoint and return combined items."""
    all_items = []
    page = 1

    while True:
        response = get(
            url,
            headers,
            params={"per_page": per_page, "page": page},
        )

        if not isinstance(response, dict):
            raise RuntimeError(f"Invalid HTB response on page {page}.")

        items = response.get("data")
        meta = response.get("meta")

        if not isinstance(items, list) or not isinstance(meta, dict):
            raise RuntimeError(f"Invalid HTB pagination structure on page {page}.")

        last_page = meta.get("last_page")

        if not isinstance(last_page, int) or last_page < 1:
            raise RuntimeError(f"Invalid HTB last_page value on page {page}.")

        all_items.extend(items)

        if page >= last_page:
            break

        page += 1

    return all_items


def fetch_machines():
    print("Fetching machines...")

    data = get(f"{HTB_BASE_V5}/machines", HTB_HEADERS, params={"per_page": 1000})
    machines = data.get("data", [])
    save("machines", data)
    print(f"  machines: {len(machines)}")

    for tier in [1, 2, 3]:
        tier_data = get(f"{HTB_BASE_V5}/machines", HTB_HEADERS, params={"spTier": tier})
        sp_machines = tier_data.get("data", [])
        save(f"machines_sp_tier{tier}", tier_data)
        print(f"  sp tier {tier}: {len(sp_machines)}")


def fetch_academy():
    print("Fetching academy...")

    stats = get(f"{ACADEMY_BASE}/modules/statistics", ACADEMY_HEADERS)
    modules_data = get(f"{ACADEMY_BASE}/modules", ACADEMY_HEADERS, params={"per_page": 200})
    modules = modules_data.get("data", [])

    save("academy_stats", stats)
    save("academy_modules", modules_data)
    print(f"  modules: {len(modules)}")


def fetch_sherlocks():
    print("Fetching sherlocks...")

    items = get_all_pages(f"{HTB_BASE_V4}/sherlocks", HTB_HEADERS)
    save("sherlocks", {"data": items, "total": len(items)})
    print(f"  sherlocks: {len(items)}")


def fetch_challenges():
    print("Fetching challenges...")

    items = get_all_pages(f"{HTB_BASE_V4}/challenges", HTB_HEADERS)
    save("challenges", {"data": items, "total": len(items)})
    print(f"  challenges: {len(items)}")


def main():
    if not HTB_TOKEN:
        print("ERROR: HTB_API_TOKEN is not set in .env", file=sys.stderr)
        sys.exit(1)

    parser = argparse.ArgumentParser(
        description="HTB data fetcher for exploration.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--machines",   action="store_true", help="Fetch machines (regular + SP tiers)")
    parser.add_argument("--academy",    action="store_true", help="Fetch Academy modules")
    parser.add_argument("--sherlocks",  action="store_true", help="Fetch Sherlocks")
    parser.add_argument("--challenges", action="store_true", help="Fetch Challenges")
    parser.add_argument("--all",        action="store_true", help="Fetch everything")

    args = parser.parse_args()

    if not any(vars(args).values()):
        parser.print_help()
        sys.exit(0)

    try:
        if args.all or args.machines:
            fetch_machines()
        if args.all or args.academy:
            fetch_academy()
        if args.all or args.sherlocks:
            fetch_sherlocks()
        if args.all or args.challenges:
            fetch_challenges()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)

    print(f"\nDone. JSON files saved to .data/")


if __name__ == "__main__":
    main()