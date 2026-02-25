from __future__ import annotations

import json
from pathlib import Path

import pdfplumber


APP_ROOT = Path(__file__).resolve().parents[1]
# 使用新的单词 PDF 源文件
PDF_PATH = APP_ROOT / "JN026wordlist.pdf"
OUTPUT_PATH = APP_ROOT / "data" / "vocab.json"


def extract_raw_lines() -> list[str]:
  lines: list[str] = []
  with pdfplumber.open(PDF_PATH) as pdf:
    for page in pdf.pages:
      text = page.extract_text() or ""
      for raw in text.splitlines():
        line = raw.strip()
        if not line:
          continue
        lines.append(line)
  return lines


def parse_line(idx: int, line: str) -> dict | None:
  parts = line.split()
  if len(parts) < 3:
    return None

  kanji = parts[0]
  kana = parts[1]
  meaning_zh = " ".join(parts[2:])

  return {
    "id": f"v{idx}",
    "kanji": kanji,
    "kana": kana,
    "meaningZh": meaning_zh,
    "exampleJa": "",
    "exampleZh": "",
  }


def main() -> None:
  if not PDF_PATH.exists():
    raise SystemExit(f"找不到 PDF 文件: {PDF_PATH}")

  lines = extract_raw_lines()

  vocab_items: list[dict] = []
  for idx, line in enumerate(lines, start=1):
    item = parse_line(idx, line)
    if item is not None:
      vocab_items.append(item)

  OUTPUT_PATH.write_text(
    json.dumps(vocab_items, ensure_ascii=False, indent=2),
    encoding="utf-8",
  )
  print(f"已从 PDF 提取 {len(vocab_items)} 条记录，写入 {OUTPUT_PATH}")


if __name__ == "__main__":
  main()

