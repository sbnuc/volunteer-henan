"""Try to find the actual API endpoint by examining gaokao.cn JavaScript"""
import requests
import json
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}

# The gaokao.cn website loads data from static-data.gaokao.cn
# Let's try to find the correct URL pattern
# From the page HTML, we can see it loads JS chunks

# Try to fetch the config JS that might contain API endpoints
urls_to_try = [
    "https://static-gkcx.gaokao.cn/www/2.0/js/config/7001/config.js",
    "https://static-gkcx.gaokao.cn/www/2.0/js/config/seotdk/config2.js",
    "https://static-data.gaokao.cn/www/2.0/yk/user/cate.js",
]

for url in urls_to_try:
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            text = resp.text
            print(f"OK: {url}")
            # Look for API endpoints
            api_patterns = re.findall(r'(https?://[^"\'`\s]+(?:api|data)[^"\'`\s]*)', text)
            if api_patterns:
                for p in api_patterns[:5]:
                    print(f"  API: {p}")
            # Also look for score-related patterns
            score_patterns = re.findall(r'(score|provinceline|specialscore|admission|plan)[^"\'`\s]*', text, re.IGNORECASE)
            if score_patterns:
                print(f"  Score patterns: {set(score_patterns)}")
            # Print first 500 chars
            print(f"  Content (first 500): {text[:500]}")
            print()
        else:
            print(f"{resp.status_code}: {url}")
    except Exception as e:
        print(f"Error: {url} - {e}")
