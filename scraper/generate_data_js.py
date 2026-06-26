"""
将merged.json转换为前端可用的data.js格式
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
MERGED_FILE = os.path.join(DATA_DIR, "merged.json")
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data_real.js")

YEARS = [2023, 2024, 2025]


def generate_data_js():
    if not os.path.exists(MERGED_FILE):
        print("ERROR: merged.json not found! Run merge.py first.")
        return

    with open(MERGED_FILE, "r", encoding="utf-8") as f:
        merged = json.load(f)

    print(f"Loaded {len(merged)} universities from merged.json")

    lines = []
    lines.append("// 全国高校数据（2023-2025年河南省真实录取数据）")
    lines.append("// 数据来源：EOL阳光高考API")
    lines.append("// 生成时间：2026年6月")
    lines.append("const universities = [")
    lines.append("    // ========== 985高校 ==========")

    last_level = ""
    for u in merged:
        level = u.get("level", "")
        if "985" in level and last_level != "985":
            lines.append("    // ========== 985高校 ==========")
            last_level = "985"
        elif "211" in level and "985" not in level and last_level != "211":
            lines.append("    // ========== 211高校 ==========")
            last_level = "211"
        elif "双一流" in level and "985" not in level and "211" not in level and last_level != "double":
            lines.append("    // ========== 双一流高校 ==========")
            last_level = "double"

        scores_dict = u.get("scores", {})
        ranking_dict = u.get("ranking", {})

        scores_str = ", ".join(
            f'{y}: {scores_dict.get(str(y)) or "null"}'
            for y in YEARS
        )
        ranking_str = ", ".join(
            f'{y}: {ranking_dict.get(str(y)) or "null"}'
            for y in YEARS
        )

        majors = u.get("majors", [])
        majors_js = []
        for m in majors[:20]:
            m_scores = m.get("scores", {})
            m_ranking = m.get("ranking", {})
            m_scores_str = ", ".join(
                f'{y}: {m_scores.get(str(y)) or "null"}'
                for y in YEARS
            )
            m_ranking_str = ", ".join(
                f'{y}: {m_ranking.get(str(y)) or "null"}'
                for y in YEARS
            )
            subject_req = "不限"
            batch = m.get("batch", "")
            if "提前" in batch:
                subject_req = "详见招生章程"
            majors_js.append(
                f'{{ name: {json.dumps(m["name"], ensure_ascii=False)}, '
                f'scores: {{ {m_scores_str} }}, '
                f'ranking: {{ {m_ranking_str} }}, '
                f'subjectReq: "{subject_req}" }}'
            )

        majors_str = ", ".join(majors_js)

        lines.append(
            f'    {{ name: {json.dumps(u["name"], ensure_ascii=False)}, '
            f'level: {json.dumps(level, ensure_ascii=False)}, '
            f'city: {json.dumps(u.get("city", ""), ensure_ascii=False)}, '
            f'type: {json.dumps(u.get("type", ""), ensure_ascii=False)}, '
            f'scores: {{ {scores_str} }}, '
            f'ranking: {{ {ranking_str} }}, '
            f'majors: [{majors_str}] }},'
        )

    lines.append("];")
    lines.append("")

    output_path = OUTPUT_FILE
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Generated {output_path} with {len(merged)} universities")
    file_size = os.path.getsize(output_path)
    print(f"File size: {file_size / 1024:.1f} KB")


if __name__ == "__main__":
    generate_data_js()
