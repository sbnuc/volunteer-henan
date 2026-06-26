"""
河南省高考分数线数据抓取器
从EOL阳光高考API获取全国院校在河南省的录取分数线和位次数据
"""
import requests
import json
import time
import random
import os
import sys

BASE_URL = "https://api.eol.cn/gkcx/api/"
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
SCORES_DIR = os.path.join(DATA_DIR, "scores")
SCHOOLS_FILE = os.path.join(DATA_DIR, "schools.json")
PROGRESS_FILE = os.path.join(DATA_DIR, "progress.json")
FAILED_FILE = os.path.join(DATA_DIR, "failed.json")
MERGED_FILE = os.path.join(DATA_DIR, "merged.json")

YEARS = [2023, 2024, 2025]
HENAN_PROVINCE_ID = "41"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Referer": "https://www.gaokao.cn/",
    "Accept": "application/json, text/plain, */*",
}


def api_get(uri, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            resp = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=15)
            data = resp.json()
            if data.get("code") == "0000":
                return data.get("data", {})
            else:
                if attempt < max_retries - 1:
                    time.sleep(2 * (attempt + 1))
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 * (attempt + 1))
    return None


def fetch_province_scores(school_id):
    all_items = []
    for year in YEARS:
        page = 1
        while True:
            params = {
                "access_token": "",
                "school_id": str(school_id),
                "local_province_id": HENAN_PROVINCE_ID,
                "year": str(year),
                "page": str(page),
                "size": "20",
                "request_type": "1",
                "uri": "apidata/api/gk/score/province",
            }
            data = api_get("apidata/api/gk/score/province", params)
            if data is None:
                break
            if isinstance(data, dict):
                items = data.get("item", [])
            elif isinstance(data, list):
                items = data
            else:
                items = []
            if not items:
                break
            for item in items:
                item["year"] = year
                item["data_type"] = "province"
            all_items.extend(items)
            if len(items) < 20:
                break
            page += 1
            time.sleep(random.uniform(0.3, 0.8))
        time.sleep(random.uniform(0.2, 0.5))
    return all_items


def fetch_special_scores(school_id):
    all_items = []
    for year in YEARS:
        page = 1
        while True:
            params = {
                "access_token": "",
                "school_id": str(school_id),
                "local_province_id": HENAN_PROVINCE_ID,
                "year": str(year),
                "page": str(page),
                "size": "20",
                "request_type": "1",
                "uri": "apidata/api/gk/score/special",
            }
            data = api_get("apidata/api/gk/score/special", params)
            if data is None:
                break
            if isinstance(data, dict):
                items = data.get("item", [])
            elif isinstance(data, list):
                items = data
            else:
                items = []
            if not items:
                break
            for item in items:
                item["year"] = year
                item["data_type"] = "special"
            all_items.extend(items)
            if len(items) < 20:
                break
            page += 1
            time.sleep(random.uniform(0.3, 0.8))
        time.sleep(random.uniform(0.2, 0.5))
    return all_items


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"completed": [], "failed": []}


def save_progress(progress):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False)


def load_failed():
    if os.path.exists(FAILED_FILE):
        with open(FAILED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_failed(failed):
    with open(FAILED_FILE, "w", encoding="utf-8") as f:
        json.dump(failed, f, ensure_ascii=False)


def main():
    os.makedirs(SCORES_DIR, exist_ok=True)

    if not os.path.exists(SCHOOLS_FILE):
        print("ERROR: schools.json not found! Run schools.py first.")
        return

    with open(SCHOOLS_FILE, "r", encoding="utf-8") as f:
        schools = json.load(f)

    print(f"Loaded {len(schools)} schools")

    progress = load_progress()
    completed = set(progress["completed"])
    failed_list = load_failed()
    failed_ids = set(f["school_id"] for f in failed_list)

    remaining = [s for s in schools if s["school_id"] not in completed]
    print(f"Remaining: {len(remaining)} schools to fetch")

    if not remaining:
        print("All schools already completed!")
        return

    total = len(remaining)
    for i, school in enumerate(remaining):
        school_id = school["school_id"]
        school_name = school["name"]
        print(f"\n[{i+1}/{total}] {school_name} (id={school_id})")

        try:
            province_data = fetch_province_scores(school_id)
            print(f"  Province scores: {len(province_data)} records")

            special_data = fetch_special_scores(school_id)
            print(f"  Special scores: {len(special_data)} records")

            school_data = {
                "school_id": school_id,
                "name": school_name,
                "level": school.get("level", ""),
                "is_985": school.get("is_985", False),
                "is_211": school.get("is_211", False),
                "dual_class": school.get("dual_class", ""),
                "city": school.get("city", ""),
                "province": school.get("province", ""),
                "type": school.get("type", ""),
                "nature": school.get("nature", ""),
                "province_scores": province_data,
                "special_scores": special_data,
            }

            score_file = os.path.join(SCORES_DIR, f"{school_id}.json")
            with open(score_file, "w", encoding="utf-8") as f:
                json.dump(school_data, f, ensure_ascii=False, indent=2)

            completed.add(school_id)
            progress["completed"] = list(completed)
            save_progress(progress)

            time.sleep(random.uniform(0.3, 0.8))

        except Exception as e:
            print(f"  ERROR: {e}")
            failed_list.append({"school_id": school_id, "name": school_name, "error": str(e)})
            save_failed(failed_list)

    print(f"\nDone! Completed: {len(completed)}, Failed: {len(failed_list)}")


if __name__ == "__main__":
    main()
