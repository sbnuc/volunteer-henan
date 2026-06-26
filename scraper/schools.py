"""
从EOL阳光高考API获取全部院校列表
"""
import requests
import json
import time
import random
import os

BASE_URL = "https://api.eol.cn/gkcx/api/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Referer": "https://www.gaokao.cn/",
    "Accept": "application/json, text/plain, */*",
}

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
SCHOOLS_FILE = os.path.join(DATA_DIR, "schools.json")


def fetch_schools_page(page=1, size=20):
    params = {
        "access_token": "",
        "keyword": "",
        "province_id": "",
        "school_id": "",
        "major_id": "",
        "nature": "0",
        "speciality_id": "",
        "dual_class": "",
        "is_doublehigh": "",
        "school_type": "",
        "ranktype": "",
        "request_type": "1",
        "page": str(page),
        "size": str(size),
        "uri": "apidata/api/gkv3/school/lists",
    }
    try:
        resp = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=15)
        data = resp.json()
        if data.get("code") == "0000":
            return data["data"]
        else:
            print(f"  API error: {data.get('message')}")
            return None
    except Exception as e:
        print(f"  Request failed: {e}")
        return None


def fetch_all_schools():
    print("Fetching school list from EOL API...")
    all_schools = []
    page = 1
    size = 100
    total = None

    while True:
        print(f"  Page {page}...", end=" ")
        data = fetch_schools_page(page=page, size=size)
        if not data:
            print("Failed, retrying...")
            time.sleep(3)
            data = fetch_schools_page(page=page, size=size)
            if not data:
                print("Still failed, skipping page")
                page += 1
                continue

        items = data.get("item", [])
        if total is None:
            total = int(data.get("numFound", 0))
            print(f"Total schools: {total}")

        if not items:
            print("No more data")
            break

        all_schools.extend(items)
        print(f"Got {len(items)} schools (total so far: {len(all_schools)})")

        if len(all_schools) >= total:
            break

        page += 1
        time.sleep(random.uniform(0.5, 1.5))

    return all_schools


def process_schools(raw_schools):
    processed = []
    for s in raw_schools:
        school = {
            "school_id": s.get("school_id"),
            "name": s.get("name", ""),
            "code": s.get("code_enroll", ""),
            "city": s.get("city_name", ""),
            "province": s.get("province_name", ""),
            "province_id": s.get("province_id", ""),
            "type": s.get("type_name", ""),
            "nature": s.get("nature_name", ""),
            "belong": s.get("belong", ""),
            "is_985": s.get("f985") == 1,
            "is_211": s.get("f211") == 1,
            "dual_class": s.get("dual_class_name", ""),
            "level": s.get("level_name", ""),
            "rank": s.get("rank", ""),
        }
        processed.append(school)
    return processed


def main():
    os.makedirs(DATA_DIR, exist_ok=True)

    raw_schools = fetch_all_schools()
    if not raw_schools:
        print("No schools fetched!")
        return

    schools = process_schools(raw_schools)

    with open(SCHOOLS_FILE, "w", encoding="utf-8") as f:
        json.dump(schools, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Saved {len(schools)} schools to {SCHOOLS_FILE}")

    levels = {}
    for s in schools:
        lvl = "other"
        if s["is_985"]:
            lvl = "985"
        elif s["is_211"]:
            lvl = "211"
        elif s["dual_class"]:
            lvl = "double_first_class"
        levels[lvl] = levels.get(lvl, 0) + 1
    print("Distribution:", levels)


if __name__ == "__main__":
    main()
