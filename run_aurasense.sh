#!/usr/bin/env bash
# AuraSense full-stack one-shot launcher (Jetson)
# Starts: STDP, World Model, Agent Crew, 8-Lane Engine, Playground UI
# Logs go to ~/aurasense-platform/logs/

set -e
ROOT="$HOME/aurasense-platform"
LOGDIR="$ROOT/logs"
mkdir -p "$LOGDIR"

export PATH="$HOME/.local/bin:$PATH"
export PYTHONPATH="$ROOT/nepa_runtime:$PYTHONPATH"

echo "🧹 Killing any lingering services on 8765-8768 / 3010..."
for port in 8765 8766 8767 8768 3010; do
  pid=$(lsof -t -i :$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "   killing pid $pid on :$port"
    kill -9 $pid 2>/dev/null || true
  fi
done
sleep 1

# Track child PIDs to clean up on Ctrl-C
PIDS=()
cleanup() {
  echo
  echo "🛑 Stopping all AuraSense services..."
  for pid in "${PIDS[@]}"; do
    kill $pid 2>/dev/null || true
  done
  exit 0
}
trap cleanup INT TERM

start_service() {
  local name=$1; local module=$2; local port=$3
  echo "🚀 Starting $name on :$port  (logs: $LOGDIR/$name.log)"
  ( cd "$ROOT/nepa_runtime" && \
    uvicorn "$module:app" --host 0.0.0.0 --port $port \
      > "$LOGDIR/$name.log" 2>&1 ) &
  PIDS+=($!)
}

start_service "stdp"       "nepa_runtime.stdp_server"  8765
start_service "worldmodel" "nepa_runtime.world_model"  8766
start_service "crew"       "nepa_runtime.agent_crew"   8767
start_service "preengine"  "nepa_runtime.pre_engine"   8768

# Wait for all backends to come up
echo "⏳ Waiting for backends to respond..."
for port in 8765 8766 8767 8768; do
  for i in {1..15}; do
    if curl -fs "http://localhost:$port/health" > /dev/null 2>&1; then
      echo "   ✅ :$port up"
      break
    fi
    sleep 1
  done
done

# Start playground frontend (filtered, only the playground app)
echo "🚀 Starting Playground UI on :3010"
( cd "$ROOT" && \
  npm run dev -- --filter=aurasense-playground -- --port 3010 \
    > "$LOGDIR/playground.log" 2>&1 ) &
PIDS+=($!)

# Wait for playground
for i in {1..30}; do
  if curl -fs "http://localhost:3010" > /dev/null 2>&1; then
    echo "   ✅ :3010 up"
    break
  fi
  sleep 1
done

cat <<EOF

════════════════════════════════════════════════════════════════
   🧠  AURASENSE FULL STACK ONLINE
════════════════════════════════════════════════════════════════
   🎯  STDP core           http://localhost:8765/health
   🌍  World Model         http://localhost:8766/wm/state
   👥  Agent Crew          http://localhost:8767/agents/decide
   🛣️   8-Lane Pre-Engine  http://localhost:8768/health
   🖥️   Playground UI       http://localhost:3010/hk-trainer.html
   📜  Logs:               $LOGDIR/
════════════════════════════════════════════════════════════════

Press Ctrl-C to stop everything cleanly.
EOF

# Stream logs from all services so you see live activity
tail -f "$LOGDIR"/*.log
