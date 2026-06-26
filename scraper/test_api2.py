"""Try to find working score data APIs"""
import requests
import json

school_id = 140  # 清华大学
province_id = 41  # 河南

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.gaokao.cn/",
}

# Try different URI patterns (without version prefix)
uris = [
    "apidata/api/gk/school/provinceline",
    "apidata/api/gk/school/province",
    "apidata/api/gk/school/special",
    "apidata/api/gk/school/plan",
    "apidata/api/gk/school/score",
    "apidata/api/gk/school/admission",
    "apidata/api/gk/school/majorscore",
    "apidata/api/gk/school/profscoreline",
    "apidata/api/gk/special/scoreline",
    "apidata/api/gk/school/provinceline",
    "apidata/api/gkv2/school/provinceline",
    "apidata/api/gkv2/school/province",
    "apidata/api/gkv2/school/special",
    "apidata/api/gkv2/school/plan",
    "apidata/api/gkv2/school/score",
    "apidata/api/gkv2/school/admission",
    "apidata/api/gkv4/school/provinceline",
    "apidata/api/gkv4/school/province",
    "apidata/api/gkv4/school/special",
    "apidata/api/gkv4/school/plan",
]

for ep in uris:
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
            pass  # skip failures silently
    except Exception as e:
        pass

print("\n--- Now trying dxsbb.com search for Tsinghua ---")
# Try dxsbb.com with a known URL pattern
try:
    resp = requests.get(
        "https://www.dxsbb.com/news/163089.html",
        headers=headers,
        timeout=10,
    )
    if resp.status_code == 200:
        text = resp.text
        print(f"dxsbb: OK, length={len(text)}")
        # Search for score data
        for keyword in ["录取分数线", "最低分", "位次", "河南"]:
            if keyword in text:
                print(f"  Found: {keyword}")
    else:
        print(f"dxsbb: {resp.status_code}")
except Exception as e:
    print(f"dxsbb: Error: {e}")

# Try baidu/gaokao.com search
print("\n--- Trying gaokao.com API ---")
try:
    resp = requests.get(
        "https://api.gaokao.cn/api/school/info?school_id=140",
        headers=headers,
        timeout=10,
    )
    if resp.status_code == 200:
        data = resp.json()
        print(f"gaokao.com: code={data.get('code')}")
        if data.get('code') == 0:
            print(f"  Data: {json.dumps(data.get('data', {}), ensure_ascii=False)[:300]}")
    else:
        print(f"gaokao.com: {resp.status_code}")
except Exception as e:
    print(f"gaokao.com: Error: {e}")
