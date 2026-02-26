from __future__ import annotations

import csv
import json
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = APP_ROOT / "N3单词new.csv"
OUTPUT_PATH = APP_ROOT / "data" / "vocab.json"


def normalize_text(value: str) -> str:
  # Normalize common whitespace artifacts while keeping Japanese/Chinese text.
  return " ".join(value.replace("\u3000", " ").split())


def main() -> None:
  if not CSV_PATH.exists():
    raise SystemExit(f"找不到 CSV 文件: {CSV_PATH}")

  rows: list[dict[str, str]] = []
  with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)
    if not reader.fieldnames:
      raise SystemExit("CSV 表头为空，无法转换。")

    headers = [h.strip() for h in reader.fieldnames if h and h.strip()]
    for raw_row in reader:
      cleaned: dict[str, str] = {}
      for header in headers:
        cleaned[header] = normalize_text((raw_row.get(header) or "").strip())

      # Skip entirely empty lines.
      if all(v == "" for v in cleaned.values()):
        continue
      rows.append(cleaned)

  OUTPUT_PATH.write_text(
    json.dumps(rows, ensure_ascii=False, indent=2),
    encoding="utf-8",
  )

  print(f"已清洗 {len(rows)} 条词汇并写入: {OUTPUT_PATH}")


if __name__ == "__main__":
  main()

