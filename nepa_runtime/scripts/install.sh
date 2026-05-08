#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "[1/3] Installing Python deps…"
python3 -m pip install --user -r requirements.txt
echo "[2/3] Generating protobuf stubs…"
./scripts/gen_proto.sh
echo "[3/3] Done. Run with: ./scripts/run.sh"
