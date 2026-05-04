#!/usr/bin/env bash
set -e
echo "[gpu-pod] starting gRPC runtime on :$NEPA_GRPC_PORT"
python3 -m nepa_runtime.server &
GRPC_PID=$!
sleep 2
echo "[gpu-pod] starting HTTP bridge on :$NEPA_BRIDGE_PORT"
python3 nepa_runtime/bridge/http_bridge.py &
BRIDGE_PID=$!
trap "kill $GRPC_PID $BRIDGE_PID; wait" SIGINT SIGTERM
wait -n
exit $?
