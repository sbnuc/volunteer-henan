"""Test score endpoints with different parameter combinations"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

# Try gk/score/special with various parameters
print("=== gk/score/special ===")
param_combos = [
    {"school_id": str(school_id), "province_id": str(province_id), "year": "2024", "page": "1", "size": "20", "request_type": "1", "uri": "apidata/api/gk/score/special"},
    {"school_id": str(school_id), "local_province_id": str(province_id), "year": "2024", "page": "1", "size": "20", "request_type": "1", "uri": "apidata/api/gk/score/special"},
    {"school_id": str(school_id), "province_id": str(province_id), "year": "2024", "page": "1", "size": "20", "request_type": "1", "uri": "apidata/api/gk/score/special", "local_province_id": str(province_id)},
    {"school_id": str(school_id), "province_id": str(province_id), "year": "2024", "page": "1", "size": "20", "request_type": "3", "uri": "apidata/api/gk/score/special"},
]

for i, params in enumerate(param_combos):
    params["access_token"] = ""
    try:
        resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=10)
        data = resp.json()
        code = data.get("code")
        if code == "0000":
            items = data.get("data", {}).get("item", [])
            print(f"Combo {i}: OK, items={len(items)}")
            if items:
                print(f"  Sample: {json.dumps(items[0], ensure_ascii=False)[:400]}")
        else:
            print(f"Combo {i}: code={code}")
    except Exception as e:
        print(f"Combo {i}: Error: {e}")

# Try gk/score/province
print("\n=== gk/score/province ===")
param_combos2 = [
    {"school_id": str(school_id), "province_id": str(province_id), "year": "2024", "page": "1", "size": "20", "request_type": "1", "uri": "apidata/api/gk/score/province"},
    {"school_id": str(school_id), "province_id": str(province_id), "year": "2024", "page": "1", "size": "20", "request_type": "3", "uri": "apidata/api/gk/score/province"},
    {"school_id": str(school_id), "province_id": str(province_id), "page": "1", "size": "20", "request_type": "1", "uri": "apidata/api/gk/score/province"},
]

for i, params in enumerate(param_combos2):
    params["access_token"] = ""
    try:
        resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=10)
        data = resp.json()
        code = data.get("code")
        if code == "0000":
            items = data.get("data", {}).get("item", [])
            print(f"Combo {i}: OK, items={len(items)}")
            if items:
                print(f"  Sample: {json.dumps(items[0], ensure_ascii=False)[:400]}")
        else:
            print(f"Combo {i}: code={code}")
    except Exception as e:
        print(f"Combo {i}: Error: {e}")

# Let's also try to find a school that actually has data
# Try different school IDs
print("\n=== Testing different schools ===")
test_schools = [140, 31, 114, 125, 132, 111, 66, 42, 127, 330]
for sid in test_schools:
    params = {
        "access_token": "",
        "school_id": str(sid),
        "province_id": str(province_id),
        "year": "2024",
        "page": "1",
        "size": "5",
        "request_type": "1",
        "uri": "apidata/api/gk/score/special",
    }
    try:
        resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=10)
        data = resp.json()
        code = data.get("code")
        if code == "0000":
            items = data.get("data", {}).get("item", [])
            if items:
                print(f"School {sid}: OK, items={len(items)}")
                print(f"  Sample: {json.dumps(items[0], ensure_ascii=False)[:300]}")
            else:
                pass  # skip empty
    except Exception as e:
        pass
