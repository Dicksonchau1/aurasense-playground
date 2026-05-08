#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export NEPA_BACKEND="${NEPA_BACKEND:-null}"
export NEPA_GRPC_PORT="${NEPA_GRPC_PORT:-50051}"
export NEPA_VERSION="${NEPA_VERSION:-0.4.1}"
export PYTHONUNBUFFERED=1
exec python3 -m nepa_runtime.server
