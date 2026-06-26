"""Try to find working dxsbb.com URLs and other data sources"""
import requests
import json
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Try to find dxsbb.com pages for Tsinghua in Henan
# The URL pattern seems to be /news/{id}.html
# Let's try to search for it
print("--- Searching dxsbb.com for 清华大学 ---")
try:
    resp = requests.get(
        "https://www.dxsbb.com/news/155703.html",
        headers=headers,
        timeout=10,
    )
    print(f"  Status: {resp.status_code}")
except Exception as e:
    print(f"  Error: {e}")

# Try another approach - use the search URL
print("\n--- Trying dxsbb.com search ---")
try:
    resp = requests.get(
        "https://www.dxsbb.com/search/?keyword=%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6+%E6%B2%B3%E5%8D%97+%E5%BD%95%E5%8F%96%E5%88%86%E6%95%B0%E7%BA%BF",
        headers=headers,
        timeout=10,
    )
    if resp.status_code == 200:
        # Extract links from search results
        links = re.findall(r'href="(/news/\d+\.html)"', resp.text)
        print(f"  Found {len(links)} links")
        for link in links[:5]:
            print(f"    https://www.dxsbb.com{link}")
    else:
        print(f"  Status: {resp.status_code}")
except Exception as e:
    print(f"  Error: {e}")

# Try the掌上高考 (zhangshang gaokao) API
print("\n--- Trying掌上高考 API ---")
try:
    resp = requests.get(
        "https://api.zhiyuan.gaokao.cn/api/school/detail?school_id=140",
        headers=headers,
        timeout=10,
    )
    print(f"  Status: {resp.status_code}")
except Exception as e:
    print(f"  Error: {e}")

# Try高考直通车 (gaokao zhitongche) API
print("\n--- Trying高考直通车 API ---")
try:
    resp = requests.get(
        "https://api.gaokaoztc.com/api/school/info?school_id=140",
        headers=headers,
        timeout=10,
    )
    print(f"  Status: {resp.status_code}")
except Exception as e:
    print(f"  Error: {e}")

# Try a completely different approach - use webfetch to get the gaokao.cn page
print("\n--- Trying to get gaokao.cn school page ---")
try:
    resp = requests.get(
        "https://www.gaokao.cn/school/140/provinceline",
        headers=headers,
        timeout=10,
    )
    if resp.status_code == 200:
        text = resp.text
        # Look for API calls in the page
        api_calls = re.findall(r'https?://[^"\']+', text)
        print(f"  Found {len(api_calls)} URLs in page")
        for url in api_calls[:10]:
            if 'api' in url.lower() or 'data' in url.lower():
                print(f"    {url}")
    else:
        print(f"  Status: {resp.status_code}")
except Exception as e:
    print(f"  Error: {e}")
