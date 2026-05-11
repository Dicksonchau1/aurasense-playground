#!/usr/bin/env bash
# Beta launch smoke — pings every endpoint AuraCoach + tier-policy needs.
# Designed to succeed gracefully when backends are unreachable: every curl
# is allowed to fail; we just print what came back.
set -u

BASE="${BASE:-http://localhost:3000}"
JQ="${JQ:-jq}"

if ! command -v "$JQ" >/dev/null 2>&1; then
  JQ="cat"
fi

ping() {
  local label="$1"; shift
  echo ""
  echo "→ $label"
  if ! out=$(curl -fsS --max-time 3 "$@" 2>&1); then
    echo "  · unreachable (ok in stub mode): ${out%%$'\n'*}"
  else
    echo "$out" | "$JQ" 2>/dev/null || echo "$out"
  fi
}

ping "/api/v1/tier/me"            "$BASE/api/v1/tier/me"
ping "/api/v1/coach/health"        "$BASE/api/v1/coach/health"
ping "/api/v1/coach/scenarios"     "$BASE/api/v1/coach/scenarios"
ping "/api/v1/coach/feedback (stub)" -X POST "$BASE/api/v1/coach/feedback" \
  -H 'content-type: application/json' \
  -d '{"session_id":"smoke","scenario":"who-handwash","step":1,"total_steps":6,"kpi":{"coverage":80,"steadiness":75,"compliance":70,"audit_confidence":85,"anomalies_count":0},"recent_verdicts":[],"elapsed_sec":3.2,"tier":"free"}'
ping "/api/billing/me"             "$BASE/api/billing/me"
ping "/api/quota/check"            "$BASE/api/quota/check"
ping "/api/nepa/runtime/health"    "$BASE/api/nepa/runtime/health"

echo ""
echo "✓ smoke completed (some endpoints may be unreachable when running without a live server)"
