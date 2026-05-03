# Aura Rehearse — NEPA Playground

Live: **https://playground.aurasensehk.com**

A browser-only playground for the **NEPA** (Non-invasive Envelope of Pattern Analysis) engine.

- **Rehearse** — practise on-camera. Four behavioural lanes are cross-checked against your own baseline. Nothing leaves your device.
- **Drone** — placeholder for live AI overlay on any camera feed. Webcam + YOLOv8n inference arrives in V0.5.

This is **V0**: dark UI, mock real-time metrics, locked premium lanes, zero backend.
V0.5 will add Supabase auth, save & share, dynamic OG cards, and in-browser YOLO for Drone.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Requires Node 20+.

## Project shape

```
src/
  app/
    page.tsx                 # redirects → /rehearse
    layout.tsx               # dark theme, fonts, MembershipDrawerProvider, Vercel Analytics
    rehearse/page.tsx
    drone/page.tsx
  components/
    playground-shell.tsx     # 3-column shell
    sidebar.tsx              # nav + static guest chip (V0.5: AuthButton)
    membership-drawer.tsx    # premium lane explainer
    lane-toggle.tsx          # ✓ / 🔒 chip
    rehearse/                # metrics-panel, lane-bar, mock-runtime
    drone/                   # placeholder body (V0.5: yolo-overlay, drone-metrics)
    ui/                      # button, pill, sheet
  lib/
    cn.ts                    # clsx + tailwind-merge
    copy.ts                  # canonical strings, language discipline
```

## Language discipline

The product never uses **deception, lie, truth, emotion, honesty, confidence score**.
It always frames behaviour as **anomaly, consistency, coherence, cross-check, envelope, practice**.
The single user persona is **the candidate**.

## Roadmap (read `BACKLOG.md` for everything else)

| Milestone | Scope                                                                 |
| --------- | --------------------------------------------------------------------- |
| **V0** ✅ | Mock rehearse, drone placeholder, design system, membership drawer    |
| V0.5      | Magic-link + Google auth, save/share sessions, in-browser YOLO drone  |
| V1        | Stripe gating, RTSP/SRT ingest, server-side Roboflow inference        |
| V1.5      | MBIS export                                                           |
| V2        | Aura Avatar, lip-sync detector, LiDAR                                 |

## Launch posts

See `LAUNCH.md`.
