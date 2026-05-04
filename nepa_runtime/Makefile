.PHONY: install proto run smoke test clean systemd journal stop

install:
./scripts/install.sh

proto:
./scripts/gen_proto.sh

run:
./scripts/run.sh

smoke:
python3 scripts/smoke.py

test:
python3 -m pytest tests/ -v

clean:
rm -f nepa_runtime/nepa_pb2.py nepa_runtime/nepa_pb2_grpc.py
find . -type d -name __pycache__ -exec rm -rf {} +

systemd:
./scripts/install-systemd.sh

journal:
journalctl -u nepa-runtime -f

stop:
sudo systemctl stop nepa-runtime || true
