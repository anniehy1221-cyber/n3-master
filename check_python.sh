#!/usr/bin/env bash

echo "检测 Python 环境..."

if command -v python3 >/dev/null 2>&1; then
  echo "找到 python3：$(python3 --version)"
  exit 0
elif command -v python >/dev/null 2>&1; then
  echo "找到 python：$(python --version)"
  exit 0
else
  echo "未找到 Python，可在终端中运行："
  echo "  macOS:  brew install python"
  exit 1
fi