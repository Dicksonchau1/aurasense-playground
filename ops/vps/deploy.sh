#!/usr/bin/env bash
# Run on your VPS (Ubuntu 22.04 / Debian 12 / etc.)
set -euo pipefail

DOMAIN="${1:-nepa.YOURDOMAIN.com}"
TUNNEL_USER="${2:-nepatunnel}"
TUNNEL_PORT="${3:-18080}"

echo "[1/6] Installing Caddy…"
if ! command -v caddy >/dev/null 2>&1; then
  sudo apt update
  sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | sudo tee /etc/apt/sources.list.d/caddy-stable.list
  sudo apt update
  sudo apt install -y caddy
fi

echo "[2/6] Creating tunnel user $TUNNEL_USER…"
if ! id "$TUNNEL_USER" &>/dev/null; then
  sudo useradd -m -s /usr/sbin/nologin "$TUNNEL_USER"
fi
sudo mkdir -p /home/"$TUNNEL_USER"/.ssh
sudo chown -R "$TUNNEL_USER":"$TUNNEL_USER" /home/"$TUNNEL_USER"/.ssh
sudo chmod 700 /home/"$TUNNEL_USER"/.ssh

echo "[3/6] Hardening sshd to allow this user only port-forwarding…"
if ! grep -q "Match User $TUNNEL_USER" /etc/ssh/sshd_config; then
  sudo tee -a /etc/ssh/sshd_config > /dev/null <<EEOF

# NEPA reverse tunnel — allow $TUNNEL_USER to bind on $TUNNEL_PORT only
Match User $TUNNEL_USER
    AllowTcpForwarding remote
    GatewayPorts no
    PermitOpen 127.0.0.1:$TUNNEL_PORT
    X11Forwarding no
    AllowAgentForwarding no
    PermitTTY no
    ForceCommand /bin/false
EEOF
  sudo systemctl reload ssh
fi

echo "[4/6] Writing Caddyfile to /etc/caddy/Caddyfile…"
sudo install -m 644 ops/vps/Caddyfile.local /etc/caddy/Caddyfile 2>/dev/null || \
  sudo install -m 644 /tmp/Caddyfile /etc/caddy/Caddyfile
sudo sed -i "s/nepa.YOURDOMAIN.com/$DOMAIN/g; s/you@yourdomain.com/admin@${DOMAIN#nepa.}/g" /etc/caddy/Caddyfile

echo "[5/6] Reloading Caddy…"
sudo mkdir -p /var/log/caddy
sudo chown -R caddy:caddy /var/log/caddy
sudo systemctl enable --now caddy
sudo systemctl reload caddy || sudo systemctl restart caddy

echo "[6/6] Verifying…"
sleep 3
echo ""
echo "── DNS check ──"
echo "Make sure this A record exists at your DNS provider:"
echo "  $DOMAIN → $(curl -s ifconfig.me)"
echo ""
echo "── Authorize the Jetson tunnel key ──"
echo "On the Jetson, output of:  cat ~/.ssh/nepa_tunnel_ed25519.pub"
echo ""
echo "Paste it here on the VPS:"
echo "  sudo -u $TUNNEL_USER tee -a /home/$TUNNEL_USER/.ssh/authorized_keys"
echo "  sudo chmod 600 /home/$TUNNEL_USER/.ssh/authorized_keys"
echo ""
echo "── Then start the tunnel on Jetson ──"
echo "  sudo systemctl enable --now nepa-tunnel"
echo ""
echo "── Verify end-to-end (from anywhere) ──"
echo "  curl https://$DOMAIN/health"
echo "  # → {\"ok\":true,\"runtime\":\"jetson-...\",\"node\":\"jetson-nano\"}"
