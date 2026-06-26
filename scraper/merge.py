"""
将抓取的分数数据合并为统一格式的JSON
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
SCORES_DIR = os.path.join(DATA_DIR, "scores")
MERGED_FILE = os.path.join(DATA_DIR, "merged.json")

YEARS = [2023, 2024, 2025]


def merge_all():
    if not os.path.exists(SCORES_DIR):
        print("ERROR: scores directory not found!")
        return

    files = [f for f in os.listdir(SCORES_DIR) if f.endswith(".json")]
    print(f"Found {len(files)} score files")

    merged = []
    for fname in sorted(files, key=lambda x: int(x.split(".")[0])):
        fpath = os.path.join(SCORES_DIR, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            school_data = json.load(f)

        school_id = school_data["school_id"]
        school_name = school_data["name"]

        province_scores = school_data.get("province_scores", [])
        special_scores = school_data.get("special_scores", [])

        year_scores = {}
        year_ranking = {}
        for year in YEARS:
            year_scores[year] = None
            year_ranking[year] = None

        for ps in province_scores:
            year = ps.get("year")
            if year in year_scores:
                min_score = ps.get("min")
                if min_score and min_score != "-" and min_score != "":
                    try:
                        year_scores[year] = int(min_score)
                    except (ValueError, TypeError):
                        pass
                min_rank = ps.get("min_section")
                if min_rank and min_rank != "-" and min_rank != "":
                    try:
                        year_ranking[year] = int(min_rank)
                    except (ValueError, TypeError):
                        pass

        major_groups = {}
        for ss in special_scores:
            year = ss.get("year")
            sp_name = ss.get("sp_name", "")
            spname = ss.get("spname", "")
            info = ss.get("info", "")
            level3_name = ss.get("level3_name", "")
            batch = ss.get("local_batch_name", "")
            type_name = ss.get("local_type_name", "")

            if not sp_name:
                continue

            if sp_name not in major_groups:
                major_groups[sp_name] = {
                    "name": sp_name,
                    "full_name": spname,
                    "level3_name": level3_name,
                    "batch": batch,
                    "type": type_name,
                    "scores": {},
                    "ranking": {},
                }

            min_score = ss.get("min")
            min_rank = ss.get("min_section")

            if min_score and min_score != "-" and min_score != "":
                try:
                    major_groups[sp_name]["scores"][year] = int(min_score)
                except (ValueError, TypeError):
                    pass
            if min_rank and min_rank != "-" and min_rank != "":
                try:
                    major_groups[sp_name]["ranking"][year] = int(min_rank)
                except (ValueError, TypeError):
                    pass

        majors = []
        for sp_name, mg in major_groups.items():
            latest_score = None
            latest_rank = None
            for y in reversed(YEARS):
                if mg["scores"].get(y):
                    latest_score = mg["scores"][y]
                    break
            for y in reversed(YEARS):
                if mg["ranking"].get(y):
                    latest_rank = mg["ranking"][y]
                    break

            majors.append({
                "name": mg["name"],
                "full_name": mg["full_name"],
                "level3_name": mg["level3_name"],
                "batch": mg["batch"],
                "type": mg["type"],
                "scores": {str(y): mg["scores"].get(y) for y in YEARS},
                "ranking": {str(y): mg["ranking"].get(y) for y in YEARS},
                "latest_score": latest_score,
                "latest_ranking": latest_rank,
            })

        majors.sort(key=lambda m: m.get("latest_ranking") or 999999)

        latest_score = None
        latest_ranking = None
        for y in reversed(YEARS):
            if year_scores.get(y):
                latest_score = year_scores[y]
                break
        for y in reversed(YEARS):
            if year_ranking.get(y):
                latest_ranking = year_ranking[y]
                break

        if not latest_score and not majors:
            continue

        level_str = ""
        if school_data.get("is_985"):
            level_str = "985/双一流"
        elif school_data.get("is_211"):
            level_str = "211/双一流"
        elif school_data.get("dual_class"):
            level_str = f"{school_data['dual_class']}"

        university = {
            "name": school_name,
            "level": level_str or school_data.get("level", ""),
            "city": school_data.get("city", ""),
            "type": school_data.get("type", ""),
            "scores": {str(y): year_scores.get(y) for y in YEARS},
            "ranking": {str(y): year_ranking.get(y) for y in YEARS},
            "latestScore": latest_score,
            "latestRanking": latest_ranking,
            "majors": majors,
        }

        merged.append(university)

    merged.sort(key=lambda u: u.get("latestRanking") or 999999)

    with open(MERGED_FILE, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print(f"Merged {len(merged)} universities to {MERGED_FILE}")

    stats = {
        "total_universities": len(merged),
        "with_scores": sum(1 for u in merged if u.get("latestScore")),
        "with_ranking": sum(1 for u in merged if u.get("latestRanking")),
        "with_majors": sum(1 for u in merged if u.get("majors")),
        "total_majors": sum(len(u.get("majors", [])) for u in merged),
    }
    print(f"Stats: {json.dumps(stats, indent=2)}")


if __name__ == "__main__":
    merge_all()
