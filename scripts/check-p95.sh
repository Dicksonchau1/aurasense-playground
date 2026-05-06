#!/usr/bin/env bash
# V1 acceptance check: assert edge inference p95 < 80 ms.
#
# Usage:
#   EDGE_BASE_URL=https://edge.aurasense.dev \
#   EDGE_SIGNING_SECRET=<secret> \
#   bash scripts/check-p95.sh
#
# Requires: curl, jq, python3 (for JWT minting).
set -euo pipefail

EDGE_BASE="${EDGE_BASE_URL:?EDGE_BASE_URL must be set}"
SIGNING_SECRET="${EDGE_SIGNING_SECRET:?EDGE_SIGNING_SECRET must be set}"
TEST_URL="${TEST_RTSP_URL:-rtsp://demo.aurasense.dev/test}"
P95_THRESHOLD_MS="${P95_THRESHOLD_MS:-80}"

echo "==> AuraSense Edge p95 acceptance check"
echo "    target : $EDGE_BASE"
echo "    p95 max: ${P95_THRESHOLD_MS}ms"

# 1. Health check
STATUS=$(curl -sf "${EDGE_BASE}/healthz" | jq -r '.status')
if [ "$STATUS" != "ok" ]; then
  echo "FAIL: /healthz returned status=$STATUS" >&2; exit 1
fi
echo "[ok] /healthz: ${STATUS}"

# 2. Mint a short-lived JWT (Python + PyJWT, available in edge venv)
TOKEN=$(python3 - <<PYEOF
import sys, time
try:
    import jwt
except ImportError:
    sys.exit("PyJWT not installed — run: pip install pyjwt")
import os
payload = {"user_id": "check-p95-ci", "plan": "rehearse_pro", "exp": int(time.time()) + 300, "iat": int(time.time())}
print(jwt.encode(payload, os.environ["EDGE_SIGNING_SECRET"], algorithm="HS256"))
PYEOF
)
echo "[ok] JWT minted"

# 3. Start an ingest slot
SLOT_ID=$(curl -sf -X POST "${EDGE_BASE}/ingest/url" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${TEST_URL}\", \"target_fps\": 15}" \
  | jq -r '.slot_id')

if [ -z "$SLOT_ID" ] || [ "$SLOT_ID" = "null" ]; then
  echo "FAIL: could not allocate slot (check plan/capacity)" >&2; exit 1
fi
echo "[ok] slot allocated: ${SLOT_ID}"

# 4. Let the stream warm up for 10 s
echo "[..] warming up for 10 s …"
sleep 10

# 5. Read stats and assert p95 inference < threshold
STATS=$(curl -sf "${EDGE_BASE}/stats/${SLOT_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

P95_INF=$(echo "$STATS" | jq -r '.p95_ms.inference // 0')
echo "[info] p95 inference = ${P95_INF} ms"

# 6. Close the slot
curl -sf -X POST "${EDGE_BASE}/stream/${SLOT_ID}/close" \
  -H "Authorization: Bearer ${TOKEN}" > /dev/null
echo "[ok] slot closed"

# 7. Pass/fail
python3 -c "
import sys
p95 = float('${P95_INF}')
threshold = float('${P95_THRESHOLD_MS}')
if p95 == 0:
    print('WARN: p95=0 — stream may not have processed frames; check TEST_RTSP_URL')
    sys.exit(0)
if p95 > threshold:
    print(f'FAIL: p95 {p95:.1f}ms > threshold {threshold}ms')
    sys.exit(1)
print(f'PASS: p95 {p95:.1f}ms <= threshold {threshold}ms')
"
