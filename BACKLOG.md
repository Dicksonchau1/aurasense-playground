# BACKLOG

Anything that arrives after V0 ship goes here, **not** into the current milestone.

## V0.5 (planned)

- Supabase auth (magic link + Google OAuth)
- Save Session → snapshot upload → public share URL
- Dynamic OG image per session (`/rehearse/[id]/opengraph-image`)
- `/account` page — last 20 sessions
- Drone lane: webcam + YOLOv8n in-browser inference (WebGPU → WASM fallback)
- Drone metrics panel (Full Pipeline vs Core NEPA latency)

## V1 (planned)

- Stripe billing + paid gating enforcement
- RTSP / SRT ingest
- Server-side Roboflow inference backend
- Production HUD

## V1.5

- MBIS export

## V2

- Aura Avatar
- Lip-sync detector
- LiDAR

## Inbound (uncategorised)

_Add new requests below as they arrive._

## P1 — Restore real MembershipDrawer hook
- [ ] Replace stub useMembershipDrawer in src/components/membership-drawer.tsx
- [ ] Add MembershipDrawerProvider with React.useState
- [ ] Wrap children in src/app/layout.tsx
- [ ] LaneToggle locked-click should open drawer with trigger label
- [ ] Origin: V0 agent collision (May 2026); current stub returns no-op

