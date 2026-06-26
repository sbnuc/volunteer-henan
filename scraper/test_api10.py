"""Check for ranking data and province score endpoint"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

# Check province score endpoint
print("=== gk/score/province ===")
params = {
    "access_token": "",
    "school_id": str(school_id),
    "local_province_id": str(province_id),
    "year": "2024",
    "page": "1",
    "size": "20",
    "request_type": "1",
    "uri": "apidata/api/gk/score/province",
}
resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
data = resp.json()
items = data.get("data", {}).get("item", [])
total = data.get("data", {}).get("numFound", 0)
print(f"Total: {total}, Items: {len(items)}")
if items:
    print(f"Keys: {list(items[0].keys())}")
    print(f"Sample: {json.dumps(items[0], ensure_ascii=False, indent=2)}")

# Also try to get individual major scores
# Check if there's a different endpoint for individual majors
print("\n=== Testing other endpoints ===")
other_endpoints = [
    "apidata/api/gk/score/major",
    "apidata/api/gk/score/special",
    "apidata/api/gk/school/provinceline",
]
for ep in other_endpoints:
    params["uri"] = ep
    resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=10)
    data = resp.json()
    code = data.get("code")
    if code == "0000":
        result = data.get("data", {})
        if isinstance(result, dict):
            items = result.get("item", [])
            print(f"{ep}: OK, items={len(items)}")
            if items:
                print(f"  Keys: {list(items[0].keys())[:10]}")
        else:
            print(f"{ep}: OK, data type={type(result).__name__}")
    else:
        print(f"{ep}: code={code}")

# Check if min_section is actually the ranking
print("\n=== Checking min_section as ranking ===")
params["uri"] = "apidata/api/gk/score/special"
resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
data = resp.json()
items = data.get("data", {}).get("item", [])
if items:
    for item in items[:3]:
        print(f"  {item.get('sp_name')}: min={item.get('min')}, min_section={item.get('min_section')}")
        # min_section looks like a small number (13, 17), which could be ranking within a group
        # Let's check if there's a min_rank field
        rank_fields = {k: v for k, v in item.items() if 'rank' in k.lower() or 'section' in k.lower()}
        print(f"    Rank/section fields: {rank_fields}")
