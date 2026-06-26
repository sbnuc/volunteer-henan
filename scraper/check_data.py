import json
with open("C:/Users/·/Desktop/志愿填报——河南/scraper/data/scores/140.json", "r", encoding="utf-8") as f:
    d = json.load(f)
print(f"School: {d['name']}")
print(f"Province scores: {len(d['province_scores'])}")
print(f"Special scores: {len(d['special_scores'])}")
if d['province_scores']:
    print(f"Province sample: {json.dumps(d['province_scores'][:2], ensure_ascii=False, indent=2)[:500]}")
if d['special_scores']:
    print(f"Special sample: {json.dumps(d['special_scores'][:2], ensure_ascii=False, indent=2)[:500]}")
