# RunPod L4 Deployment Guide

This document describes how to deploy the AuraSense edge GPU service to a
RunPod L4 pod and wire it to `edge.aurasense.dev`.

## Prerequisites

- Docker Hub or GHCR account credentials
- RunPod account at https://runpod.io
- Domain `aurasense.dev` with DNS edit access
- `EDGE_SIGNING_SECRET` (generate: `openssl rand -base64 32`)

## 1. Build and push the image

```bash
cd /path/to/AuraSense_NEPA

# Build for linux/amd64 (required for RunPod)
docker buildx build \
  --platform linux/amd64 \
  -t ghcr.io/dicksonchau1/aurasense-edge:v1 \
  -f Dockerfile.nepa_rest \
  --push \
  .
```

## 2. Create a RunPod Secure Cloud pod

1. Go to **RunPod → Secure Cloud → Deploy**
2. Select GPU: **NVIDIA L4 (24 GB VRAM)**
3. Container image: `ghcr.io/dicksonchau1/aurasense-edge:v1`
4. Container disk: **20 GB**
5. Expose port: **8000** (HTTP)
6. Set environment variables:

| Variable | Value |
|---|---|
| `EDGE_SIGNING_SECRET` | your 32-byte secret |
| `MAX_SLOTS` | `4` |
| `ALLOWED_ORIGINS` | `https://aurasense-playground.vercel.app,https://aurasense.dev` |
| `LOG_LEVEL` | `INFO` |

7. Click **Deploy**. Note the public IP / hostname shown in the pod details.

## 3. DNS — point edge.aurasense.dev

Add a DNS A record (or CNAME if RunPod provides a hostname):

```
Type : A
Name : edge
Value: <RunPod pod IP>
TTL  : 60
```

## 4. TLS with Caddy (reverse proxy on the pod)

RunPod pods do not terminate TLS automatically. Add a Caddy sidecar:

```bash
# SSH into the pod
caddy reverse-proxy --from edge.aurasense.dev --to localhost:8000
```

Or bake Caddy into the Dockerfile using a multi-stage build.

Alternatively, use **RunPod's HTTPS proxy** (enable in pod settings → HTTPS → Port 8000).
This gives you `https://<pod-id>-8000.proxy.runpod.net` — set `EDGE_BASE_URL` to that URL
in the playground `.env`.

## 5. Set EDGE_BASE_URL in the playground

```bash
# .env.local (Vercel project → Settings → Environment variables)
EDGE_BASE_URL=https://edge.aurasense.dev
EDGE_SIGNING_SECRET=<same secret as above>
```

## 6. Smoke test

```bash
curl https://edge.aurasense.dev/healthz
# Expected: {"status":"ok", ...}
```

Then run the p95 acceptance check:

```bash
EDGE_BASE_URL=https://edge.aurasense.dev \
EDGE_SIGNING_SECRET=<secret> \
TEST_RTSP_URL=rtsp://your-test-camera/stream \
bash scripts/check-p95.sh
```
