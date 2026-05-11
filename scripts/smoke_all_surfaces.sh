#!/usr/bin/env bash
set -euo pipefail

BASE="${RODA_API_URL:-https://roda.aurasense.ai}"
TOKEN="${RODA_SERVICE_TOKEN:?missing RODA_SERVICE_TOKEN}"
TENANT="tenant-hk-001"
SESSION="smoke-$(date +%s)"
TRACE="trace-smoke-$(date +%s)"
TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

post() {
  local path="$1"
  local body="$2"
  local label="$3"
  echo "── ${label} ──"
  curl -sS -X POST "${BASE}${path}" \
    -H "Content-Type: application/json" \
    -H "x-user-id: smoke-operator" \
    -H "x-service-token: ${TOKEN}" \
    -d "${body}" | jq '{status, event_id, event_hash, receipt_id, chained_to, verified}'
  echo
}

# 1. Playground / Rehearse-Nurse inference
post "/api/nepa/v1/rehearse-nurse/inference" "$(cat <<JSON
{
  "tenant_id": "${TENANT}",
  "session_id": "${SESSION}",
  "trace_id": "${TRACE}-nurse",
  "device_id": "playground-web-1",
  "frame_id": "handwash-step-4",
  "detector": "handwash_v1",
  "verdict": { "label": "step_4_ok", "confidence": 0.91 },
  "edge_ts": "${TS}"
}
JSON
)" "rehearse_nurse / inference"

# 2. Rehearse-Nurse HRI response
post "/api/nepa/v1/hri/respond" "$(cat <<JSON
{
  "event_id": "$(uuidgen)",
  "tenant_id": "${TENANT}",
  "session_id": "${SESSION}",
  "trace_id": "${TRACE}-nurse",
  "parent_event_id": "$(uuidgen)",
  "parent_event_hash": "$(printf 'a%.0s' {1..64})",
  "product": "rehearse_nurse",
  "device_id": "playground-web-1",
  "operator_id": "nurse-instructor-001",
  "action": "accept",
  "data_rights": "tenant_local",
  "edge_ts": "${TS}"
}
JSON
)" "rehearse_nurse / hri_interaction"

# 3. Atlas inference
post "/api/nepa/v1/atlas/inference" "$(cat <<JSON
{
  "tenant_id": "${TENANT}",
  "session_id": "${SESSION}",
  "trace_id": "${TRACE}-atlas",
  "device_id": "atlas-web-1",
  "building_id": "HK-KLN-001",
  "frame_id": "facade-north-001",
  "detector": "crack_v1",
  "verdict": { "label": "hairline_crack", "confidence": 0.78 },
  "edge_ts": "${TS}"
}
JSON
)" "atlas / inference"

# 4. Fleet inference
post "/api/nepa/v1/fleet/inference" "$(cat <<JSON
{
  "tenant_id": "${TENANT}",
  "session_id": "${SESSION}",
  "trace_id": "${TRACE}-fleet",
  "device_id": "jetson-001",
  "robot_id": "jetson-001",
  "frame_id": "patrol-frame-001",
  "detector": "obstacle_v1",
  "verdict": { "label": "obstacle_detected", "confidence": 0.84 },
  "edge_ts": "${TS}"
}
JSON
)" "fleet / inference"

# 5. Drone inference with WindSeer telemetry
post "/api/nepa/v1/drone/inference" "$(cat <<JSON
{
  "tenant_id": "${TENANT}",
  "session_id": "${SESSION}",
  "trace_id": "${TRACE}-drone",
  "device_id": "dji-001",
  "drone_id": "dji-001",
  "frame_id": "flight-001-frame-23",
  "detector": "defect_v1",
  "verdict": {
    "label": "spalling",
    "confidence": 0.81,
    "context": {
      "wind_speed_ms": 3.2,
      "wind_direction_deg": 120,
      "altitude_m": 42.5
    }
  },
  "edge_ts": "${TS}"
}
JSON
)" "drone / inference"

echo "✅ Smoke test complete. Verifying DB..."
psql "${DATABASE_URL}" -c "
  select product, kind, count(*) as events, count(receipt_id) as receipted
  from audit_events
  where session_id = '${SESSION}'
  group by product, kind
  order by product, kind;
"
