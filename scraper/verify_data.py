import json
with open("C:/Users/·/Desktop/志愿填报——河南/scraper/data/merged.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total universities: {len(data)}")
print(f"With scores: {sum(1 for u in data if u.get('latestScore'))}")
print(f"With ranking: {sum(1 for u in data if u.get('latestRanking'))}")
print(f"With majors: {sum(1 for u in data if u.get('majors'))}")
print(f"Total majors: {sum(len(u.get('majors', [])) for u in data)}")

print("\n--- Top 20 universities by ranking ---")
for u in data[:20]:
    score = u.get('latestScore', '-')
    ranking = u.get('latestRanking', '-')
    major_count = len(u.get('majors', []))
    print(f"  {u['name']}: score={score}, ranking={ranking}, majors={major_count}")

print("\n--- Sample major data (清华大学) ---")
tsinghua = next(u for u in data if u['name'] == '清华大学')
for m in tsinghua.get('majors', [])[:5]:
    print(f"  {m['name']}: score={m.get('latest_score')}, ranking={m.get('latest_ranking')}")

print("\n--- Sample major data (郑州大学) ---")
zzu = next(u for u in data if u['name'] == '郑州大学')
for m in zzu.get('majors', [])[:5]:
    print(f"  {m['name']}: score={m.get('latest_score')}, ranking={m.get('latest_ranking')}")
