#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
SVC=scripts/nepa-runtime.service
sudo cp "$SVC" /etc/systemd/system/nepa-runtime.service
sudo systemctl daemon-reload
sudo systemctl enable nepa-runtime
sudo systemctl restart nepa-runtime
sudo systemctl status nepa-runtime --no-pager | head -20
echo ""
echo "Logs:  journalctl -u nepa-runtime -f"
echo "Stop:  sudo systemctl stop nepa-runtime"
