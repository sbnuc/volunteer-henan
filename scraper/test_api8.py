"""Debug the API response"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

# First, let's reproduce the working call from test_api6.py
print("=== Reproducing working call ===")
params = {
    "access_token": "",
    "school_id": str(school_id),
    "local_province_id": str(province_id),
    "year": "2024",
    "page": "1",
    "size": "100",
    "request_type": "1",
    "uri": "apidata/api/gk/score/special",
}
resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
data = resp.json()
print(f"Code: {data.get('code')}")
print(f"Data type: {type(data.get('data'))}")
print(f"Data: {json.dumps(data.get('data'), ensure_ascii=False)[:1000]}")

# Now try the exact same params but with size=20
print("\n=== With size=20 ===")
params2 = {
    "access_token": "",
    "school_id": str(school_id),
    "local_province_id": str(province_id),
    "year": "2024",
    "page": "1",
    "size": "20",
    "request_type": "1",
    "uri": "apidata/api/gk/score/special",
}
resp2 = requests.get("https://api.eol.cn/gkcx/api/", params=params2, headers=headers, timeout=15)
data2 = resp2.json()
print(f"Code: {data2.get('code')}")
result = data2.get("data")
print(f"Data type: {type(result)}")
if isinstance(result, list):
    print(f"Items: {len(result)}")
    if result:
        print(f"First item: {json.dumps(result[0], ensure_ascii=False)[:500]}")
elif isinstance(result, dict):
    items = result.get("item", [])
    print(f"Items: {len(items)}")
    if items:
        print(f"First item: {json.dumps(items[0], ensure_ascii=False)[:500]}")
