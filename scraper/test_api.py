"""Test various API endpoints for score data"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

endpoints = [
    "apidata/api/gkv3/school/provinceline",
    "apidata/api/gkv3/school/province",
    "apidata/api/gkv3/school/special",
    "apidata/api/gkv3/school/plan",
    "apidata/api/gkv3/school/admission",
    "apidata/api/gkv3/school/profscoreline",
    "apidata/api/gkv3/school/majorscore",
    "apidata/api/gkv3/school/planprovince",
    "apidata/api/gkv3/school/provinceplan",
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
                    print(f"  Keys: {list(item_list[0].keys())[:12]}")
                    print(f"  Sample: {json.dumps(item_list[0], ensure_ascii=False)[:300]}")
            else:
                print(f"OK: {ep} -> type={type(items).__name__}")
        else:
            print(f"FAIL: {ep} -> code={code} msg={msg[:50]}")
    except Exception as e:
        print(f"ERR: {ep} -> {e}")
