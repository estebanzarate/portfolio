#!/usr/bin/env python3
"""
HTB data fetcher — exploration and data retrieval script.

Usage:
    python3 getdata/htb_fetch.py --machines
    python3 getdata/htb_fetch.py --academy
    python3 getdata/htb_fetch.py --sherlocks
    python3 getdata/htb_fetch.py --challenges
    python3 getdata/htb_fetch.py --all
    python3 getdata/htb_fetch.py --machines --challenges
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
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)

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
    path = SAMPLE_DIR / f"{name}.json"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    return path


def get(url: str, headers: dict, params: dict = None) -> dict:
    res = requests.get(url, headers=headers, params=params, timeout=30)
    res.raise_for_status()
    return res.json()


def get_all_pages(url: str, headers: dict, per_page: int = 100) -> list:
    """Fetch all pages of a paginated endpoint and return combined items."""
    all_items = []
    page = 1

    while True:
        data = get(url, headers, params={"per_page": per_page, "page": page})
        items = data.get("data", [])
        all_items.extend(items)

        last_page = data.get("meta", {}).get("last_page", 1)
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
    except requests.HTTPError as e:
        print(f"ERROR: {e.response.status_code} {e.response.reason} — {e.request.url}", file=sys.stderr)
        sys.exit(1)

    print(f"\nDone. JSON files saved to .data/")


if __name__ == "__main__":
    main()