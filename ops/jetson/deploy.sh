#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

if [ -z "${VPS_HOST:-}" ] || [ -z "${VPS_TUNNEL_USER:-}" ]; then
  echo "Usage: VPS_HOST=your.vps.ip VPS_TUNNEL_USER=nepatunnel VPS_TUNNEL_PORT=18080 ./deploy.sh"
  exit 1
fi

echo "[1/7] Generating shared token…"
TOKEN="${NEPA_RUNTIME_TOKEN:-$(openssl rand -hex 32)}"
sudo mkdir -p /etc/nepa
sudo tee /etc/nepa/bridge.env > /dev/null <<EEOF
NEPA_BRIDGE_PORT=8080
NEPA_GRPC_ADDR=localhost:50051
NEPA_RUNTIME_TOKEN=$TOKEN
NEPA_NODE_ID=jetson-$(hostname)
PYTHONUNBUFFERED=1
EEOF
sudo chmod 640 /etc/nepa/bridge.env
sudo chown root:jetson /etc/nepa/bridge.env

echo "[2/7] Installing Python deps + proto stubs…"
cd nepa_runtime && make install && cd ..

echo "[3/7] Generating SSH key for tunnel (if missing)…"
if [ ! -f ~/.ssh/nepa_tunnel_ed25519 ]; then
  ssh-keygen -t ed25519 -N "" -f ~/.ssh/nepa_tunnel_ed25519 -C "nepa-jetson-tunnel"
fi

echo "[4/7] Writing tunnel env…"
sudo tee /etc/nepa/tunnel.env > /dev/null <<EEOF
VPS_HOST=$VPS_HOST
VPS_TUNNEL_USER=$VPS_TUNNEL_USER
VPS_TUNNEL_PORT=${VPS_TUNNEL_PORT:-18080}
EEOF
sudo chmod 640 /etc/nepa/tunnel.env
sudo chown root:jetson /etc/nepa/tunnel.env

echo "[5/7] Installing systemd units…"
sudo cp nepa_runtime/scripts/nepa-runtime.service /etc/systemd/system/
sudo cp ops/jetson/nepa-bridge.service            /etc/systemd/system/
sudo cp ops/jetson/nepa-tunnel.service            /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nepa-runtime nepa-bridge

echo "[6/7] Local sanity check…"
sleep 2
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/health | python3 -m json.tool

echo ""
echo "[7/7] Now run on the VPS to authorize the tunnel:"
echo ""
echo "    sudo useradd -m -s /usr/sbin/nologin $VPS_TUNNEL_USER 2>/dev/null || true"
echo "    sudo mkdir -p /home/$VPS_TUNNEL_USER/.ssh"
echo "    echo '$(cat ~/.ssh/nepa_tunnel_ed25519.pub)' | sudo tee -a /home/$VPS_TUNNEL_USER/.ssh/authorized_keys"
echo "    sudo chown -R $VPS_TUNNEL_USER:$VPS_TUNNEL_USER /home/$VPS_TUNNEL_USER/.ssh"
echo "    sudo chmod 700 /home/$VPS_TUNNEL_USER/.ssh"
echo "    sudo chmod 600 /home/$VPS_TUNNEL_USER/.ssh/authorized_keys"
echo ""
echo "Then on Jetson: sudo systemctl enable --now nepa-tunnel"
echo ""
echo "── ADD TO VERCEL ENV VARS (Production + Preview): ──"
echo "NEPA_RUNTIME_MODE=http"
echo "NEPA_RUNTIME_URL=https://nepa.YOURDOMAIN.com"
echo "NEPA_RUNTIME_TOKEN=$TOKEN"
echo "────────────────────────────────────────────────────"
