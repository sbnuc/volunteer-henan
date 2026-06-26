"""
主入口脚本 - 协调整个抓取流程
用法:
    python run.py schools    - 获取院校列表
    python run.py scores     - 抓取分数线数据
    python run.py merge      - 合并数据
    python run.py generate   - 生成data.js
    python run.py all        - 执行全部流程
    python run.py status     - 查看当前进度
"""
import sys
import os
import json

SCRAPER_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRAPER_DIR, "data")


def cmd_schools():
    from schools import main as fetch_schools
    fetch_schools()


def cmd_scores():
    from scores import main as fetch_scores
    fetch_scores()


def cmd_merge():
    from merge import merge_all
    merge_all()


def cmd_generate():
    from generate_data_js import generate_data_js
    generate_data_js()


def cmd_status():
    schools_file = os.path.join(DATA_DIR, "schools.json")
    progress_file = os.path.join(DATA_DIR, "progress.json")
    merged_file = os.path.join(DATA_DIR, "merged.json")

    print("=== Status ===")

    if os.path.exists(schools_file):
        with open(schools_file, "r", encoding="utf-8") as f:
            schools = json.load(f)
        print(f"Schools: {len(schools)} loaded")
    else:
        print("Schools: NOT FETCHED yet")

    if os.path.exists(progress_file):
        with open(progress_file, "r", encoding="utf-8") as f:
            progress = json.load(f)
        completed = len(progress.get("completed", []))
        failed = len(progress.get("failed", []))
        print(f"Scores: {completed} completed, {failed} failed")
    else:
        print("Scores: NOT STARTED")

    scores_dir = os.path.join(DATA_DIR, "scores")
    if os.path.exists(scores_dir):
        files = [f for f in os.listdir(scores_dir) if f.endswith(".json")]
        total_size = sum(os.path.getsize(os.path.join(scores_dir, f)) for f in files)
        print(f"Score files: {len(files)} files, {total_size / 1024 / 1024:.1f} MB")
    else:
        print("Score files: NONE")

    if os.path.exists(merged_file):
        with open(merged_file, "r", encoding="utf-8") as f:
            merged = json.load(f)
        print(f"Merged: {len(merged)} universities")
    else:
        print("Merged: NOT DONE")


def cmd_all():
    print("Step 1: Fetching school list...")
    cmd_schools()
    print("\nStep 2: Fetching score data...")
    cmd_scores()
    print("\nStep 3: Merging data...")
    cmd_merge()
    print("\nStep 4: Generating data.js...")
    cmd_generate()
    print("\nAll done!")


COMMANDS = {
    "schools": cmd_schools,
    "scores": cmd_scores,
    "merge": cmd_merge,
    "generate": cmd_generate,
    "all": cmd_all,
    "status": cmd_status,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print("Usage: python run.py <command>")
        print(f"Commands: {', '.join(COMMANDS.keys())}")
        return

    cmd = sys.argv[1]
    COMMANDS[cmd]()


if __name__ == "__main__":
    main()
