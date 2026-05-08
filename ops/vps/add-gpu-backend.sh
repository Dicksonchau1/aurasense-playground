#!/usr/bin/env bash
# Usage: ./add-gpu-backend.sh https://my-pod-id-8080.proxy.runpod.net
set -euo pipefail
POD_URL="${1:?pod URL required}"
HOSTPORT=$(echo "$POD_URL" | sed -E 's|^https?://||; s|/$||')

echo "Adding $HOSTPORT to /etc/caddy/Caddyfile…"
sudo sed -i "/^        to 127.0.0.1:18080$/a\\        to $HOSTPORT" /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
echo "✅ GPU pod added to backend pool. Caddy will load-balance least_conn."
echo "   Verify: curl -I https://nepa.YOURDOMAIN.com/health"
