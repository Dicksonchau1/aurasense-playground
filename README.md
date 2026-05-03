# Aura Rehearse — NEPA Playground

> Reflects. Rehearses. Your private practice mirror. Nothing leaves your device.

Live at **[playground.aurasensehk.com/rehearse](https://playground.aurasensehk.com/rehearse)**

## What It Is

Aura Rehearse is a fully client-side interview self-coaching tool. It uses your webcam to:

- Render a live **pose skeleton overlay** (MediaPipe Tasks Vision)
- Compute an **Envelope Score** (0–100) — a weighted composite of posture, gaze, framing, and pacing
- Track a **Consistency Index** — rolling cross-variance of all lanes
- Give **adaptive tips** based on your lowest-scoring lane

All processing happens in your browser. Zero backend. Zero auth. Zero data collection.

## Running Locally

```bash
git clone https://github.com/Dicksonchau1/aurasense-playground
cd aurasense-playground
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+, App Router |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Pose Detection | MediaPipe Tasks Vision v0.10.9 (CDN) |
| Audio Analysis | Web Audio API (native) |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

## License

MIT © 2025 AuraSense HK
