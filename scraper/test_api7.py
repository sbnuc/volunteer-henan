"""Test the working score API endpoint - fix data format"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

print("=== Fetching score data for 清华大学 (school_id=140) in 河南 ===")
for year in [2024, 2023, 2025]:
    params = {
        "access_token": "",
        "school_id": str(school_id),
        "local_province_id": str(province_id),
        "year": str(year),
        "page": "1",
        "size": "100",
        "request_type": "1",
        "uri": "apidata/api/gk/score/special",
    }
    try:
        resp = requests.get("https://api.eol.cn/gkcx/api/", params=params, headers=headers, timeout=15)
        data = resp.json()
        code = data.get("code")
        if code == "0000":
            result = data.get("data", [])
            if isinstance(result, list):
                items = result
                print(f"\nYear {year}: {len(items)} items (data is list)")
                if items and isinstance(items[0], dict):
                    print(f"  Sample keys: {list(items[0].keys())}")
                    print(f"  Sample: {json.dumps(items[0], ensure_ascii=False)[:500]}")
            elif isinstance(result, dict):
                items = result.get("item", [])
                total = result.get("numFound", 0)
                print(f"\nYear {year}: {len(items)} items (total: {total})")
                if items:
                    print(f"  Sample keys: {list(items[0].keys())}")
                    print(f"  Sample: {json.dumps(items[0], ensure_ascii=False)[:500]}")
        else:
            print(f"Year {year}: code={code} msg={data.get('message', '')[:50]}")
    except Exception as e:
        print(f"Year {year}: Error: {e}")
