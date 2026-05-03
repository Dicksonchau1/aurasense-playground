# Aura Rehearse — NEPA Playground

> Reflects. Rehearses. Your private practice mirror. Nothing leaves your device.

Live at **[playground.aurasensehk.com/rehearse](https://playground.aurasensehk.com/rehearse)**

---

## What It Is

Aura Rehearse is a fully client-side interview self-coaching tool. It uses your webcam to:

- Render a live **pose skeleton overlay** (MediaPipe Tasks Vision)
- Compute an **Envelope Score** (0–100) — a weighted composite of posture, gaze, framing, and pacing
- Track a **Consistency Index** — rolling cross-variance of all lanes to detect coherent vs. drifting self-presentation
- Give **adaptive tips** based on your lowest-scoring lane

All processing happens in your browser. Zero backend. Zero auth. Zero data collection.

---

## Running Locally

```bash
git clone https://github.com/Dicksonchau1/aurasense-playground
cd aurasense-playground
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

| Layer | Technology |
|-------|----------|
| Framework | Next.js 16+, App Router |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + vaul Drawer |
| Icons | Lucide React |
| Pose Detection | MediaPipe Tasks Vision v0.10.9 (CDN, WASM) |
| Audio Analysis | Web Audio API (native) |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

---

## Architecture

```
browser
│
├── useCamera()          → getUserMedia → <video> element
├── usePose()            → MediaPipe RAF loop → landmarks[]
│    └── drawSkeleton()  → <canvas> overlay (emerald)
├── useAudioSignals()    → AnalyserNode → RMS → pacingScore
│
├── signals.ts
│    ├── postureScore()  shoulder tilt → 0-100
│    ├── gazeScore()     nose-eye alignment → 0-100
│    ├── framingScore()  nose position → 0-100
│    ├── envelope()      weighted composite
│    └── ConsistencyTracker  rolling cross-variance
│
└── <MetricsPanel>       live display
     ├── Envelope big number (aria-live)
     ├── Consistency + drift trend
     └── Per-lane progress bars
```

---

## Roadmap

### V1
- [ ] Session recording (local download only)
- [ ] Framing grid overlay
- [ ] Multi-pose support (panel interviews)

### V2
- [ ] Aura Avatar — live AI interviewer (Rehearse Pro)
- [ ] Lip-sync coherence detector
- [ ] Diagnostic report export (PDF)

### V3
- [ ] Drone Playground — RTSP/SRT URL overlay
- [ ] Career services seat management
- [ ] Mobile app (PWA)

---

## License

MIT © 2025 AuraSense HK