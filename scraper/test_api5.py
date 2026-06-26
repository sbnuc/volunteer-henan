"""Test the API endpoints found in gaokao.cn config"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

# From config.js: eneryptionList contains these URIs
endpoints = [
    "apidata/api/gk/score/special",
    "apidata/api/gk/score/province",
    "apidata/api/gk/plan/special",
    "apidata/api/gk/score/special",
    "apidata/api/gk/school/provinceline",
    "apidata/api/gk/school/province",
    "apidata/api/gk/school/special",
]

for ep in endpoints:
    params = {
        "access_token": "",
        "school_id": str(school_id),
        "province_id": str(province_id),
        "year": "2024",
        "page": "1",
        "size": "5",
        "request_type": "1",
        "uri": ep,
    }
    try:
        resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=10)
        data = resp.json()
        code = data.get("code")
        msg = data.get("message", "")
        if code == "0000":
            items = data.get("data", {})
            if isinstance(items, dict):
                item_list = items.get("item", [])
                print(f"OK: {ep} -> items={len(item_list)}")
                if item_list:
                    print(f"  Keys: {list(item_list[0].keys())[:15]}")
                    print(f"  Sample: {json.dumps(item_list[0], ensure_ascii=False)[:400]}")
            else:
                print(f"OK: {ep} -> type={type(items).__name__}")
        else:
            print(f"FAIL: {ep} -> code={code} msg={msg[:50]}")
    except Exception as e:
        print(f"ERR: {ep} -> {e}")

# Also try without year parameter
print("\n--- Without year parameter ---")
for ep in endpoints[:3]:
    params = {
        "access_token": "",
        "school_id": str(school_id),
        "province_id": str(province_id),
        "page": "1",
        "size": "5",
        "request_type": "1",
        "uri": ep,
    }
    try:
        resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=10)
        data = resp.json()
        code = data.get("code")
        if code == "0000":
            items = data.get("data", {})
            if isinstance(items, dict):
                item_list = items.get("item", [])
                print(f"OK: {ep} -> items={len(item_list)}")
                if item_list:
                    print(f"  Keys: {list(item_list[0].keys())[:15]}")
                    print(f"  Sample: {json.dumps(item_list[0], ensure_ascii=False)[:400]}")
        else:
            print(f"FAIL: {ep} -> code={code}")
    except Exception as e:
        print(f"ERR: {ep} -> {e}")
