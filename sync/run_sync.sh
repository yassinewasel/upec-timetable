#!/bin/sh
set -eu
BASE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
python3 "$BASE_DIR/sync/formadep_sync.py" --auto --out "$BASE_DIR/public_html/data/edt.json"
python3 "$BASE_DIR/sync/formadep_sync_fa2.py" --auto --out "$BASE_DIR/public_html/data/fa2.json"
