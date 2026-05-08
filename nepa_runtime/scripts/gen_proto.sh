#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m grpc_tools.protoc \
  -I proto \
  --python_out=nepa_runtime \
  --grpc_python_out=nepa_runtime \
  proto/nepa.proto
# Fix relative import in the generated grpc stub
sed -i 's/^import nepa_pb2 as nepa__pb2/from . import nepa_pb2 as nepa__pb2/' nepa_runtime/nepa_pb2_grpc.py
echo "✅ Generated nepa_runtime/nepa_pb2.py + nepa_pb2_grpc.py"
