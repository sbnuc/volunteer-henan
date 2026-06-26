"""Get full item structure and test pagination"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

# Get full item structure
print("=== Full item structure ===")
params = {
    "access_token": "",
    "school_id": str(school_id),
    "local_province_id": str(province_id),
    "year": "2024",
    "page": "1",
    "size": "20",
    "request_type": "1",
    "uri": "apidata/api/gk/score/special",
}
resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
data = resp.json()
items = data.get("data", {}).get("item", [])
total = data.get("data", {}).get("numFound", 0)
print(f"Total: {total}, Items in page: {len(items)}")
if items:
    print(f"\nAll keys: {list(items[0].keys())}")
    print(f"\nFirst item (full): {json.dumps(items[0], ensure_ascii=False, indent=2)}")
    if len(items) > 1:
        print(f"\nSecond item: {json.dumps(items[1], ensure_ascii=False, indent=2)}")

# Test pagination
print("\n=== Testing pagination ===")
for page in [1, 2, 3]:
    params["page"] = str(page)
    resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
    data = resp.json()
    items = data.get("data", {}).get("item", [])
    print(f"Page {page}: {len(items)} items")
    if not items:
        break

# Test different years
print("\n=== Testing different years ===")
for year in [2025, 2024, 2023]:
    params["year"] = str(year)
    params["page"] = "1"
    resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
    data = resp.json()
    items = data.get("data", {}).get("item", [])
    total = data.get("data", {}).get("numFound", 0)
    print(f"Year {year}: {len(items)} items (total: {total})")
