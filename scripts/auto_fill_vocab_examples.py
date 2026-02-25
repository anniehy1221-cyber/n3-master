from __future__ import annotations

import json
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
VOCAB_PATH = APP_ROOT / "data" / "vocab.json"


def main() -> None:
  if not VOCAB_PATH.exists():
    raise SystemExit(f"找不到 vocab.json 文件: {VOCAB_PATH}")

  raw = VOCAB_PATH.read_text(encoding="utf-8")
  items: list[dict] = json.loads(raw)

  updated = 0
  for item in items:
    example_ja = (item.get("exampleJa") or "").strip()
    example_zh = (item.get("exampleZh") or "").strip()
    kanji = (item.get("kanji") or "").strip()
    meaning_zh = (item.get("meaningZh") or "").strip()

    if example_ja or example_zh:
      # 已经有人工例句的就不改
      continue

    if not kanji or not meaning_zh:
      # 缺关键字段就跳过，避免生成奇怪句子
      continue

    # 生成一个通用但自然的例句，后续你可以按需细调
    item["exampleJa"] = f"{kanji}は日常生活でよく使われる表現です。"
    item["exampleZh"] = f"「{kanji}」是日常生活中经常使用的表达，意思是「{meaning_zh}」。"
    updated += 1

  VOCAB_PATH.write_text(
    json.dumps(items, ensure_ascii=False, indent=2),
    encoding="utf-8",
  )

  print(f"已为 {updated} 条词汇自动补充示例句，写回 {VOCAB_PATH}")


if __name__ == "__main__":
  main()

