# Aura Rehearse — Launch Assets

## X / LinkedIn Post

Just shipped Aura Rehearse — your private interview practice mirror.

Live envelope score + consistency index from your webcam. 100% in-browser. Nothing leaves your device. Free.

playground.aurasensehk.com/rehearse

Drone perception playground + Aura Avatar + lip-sync coherence detector coming in V2. Built on NEPA runtime by AuraSense HK.

---

## Show HN Draft

**Title:** Show HN: Aura Rehearse — private interview practice mirror (all in-browser)

**Body:**

I built Aura Rehearse, a free, fully client-side interview self-coaching tool that runs entirely in your browser — no backend, no auth, no data leaving your device.

It uses MediaPipe Tasks Vision (WebAssembly, loaded from CDN) to detect your pose from the webcam, then computes:

- **Envelope Score** (0–100): a weighted composite of posture, gaze, framing, and pacing
- **Consistency Index**: rolling cross-variance of all lanes — are your signals drifting together (coherent) or decoupling under pressure?
- **Adaptive tips** based on your lowest-scoring lane in real time

The Web Audio API tracks your speech/silence ratio and outputs a pacing score that peaks at 60–70% speech.

Everything runs at ~30 FPS in-browser. The skeleton overlay, the score updates, the pacing detection — all local compute.

No recording. No server. No cookies. Just a practice mirror.

Coming in V2: Aura Avatar (live AI interviewer), lip-sync coherence detector, and the Drone Playground (RTSP/SRT feed overlay).

Live: https://playground.aurasensehk.com/rehearse
Repo: https://github.com/Dicksonchau1/aurasense-playground

---

## Known V0 Limitations (for V0.1 follow-up)

- Pacing score uses microphone RMS threshold — may misclassify background noise as speech
- Gaze score is a heuristic proxy (nose-eye midpoint alignment), not true gaze tracking
- No session persistence — scores reset on page refresh
- Drone page is a waitlist placeholder only
- Aura Avatar and Lip-sync detector are locked teasers (V2)
- OG image uses static /og.png fallback on some crawlers
- Lighthouse performance may dip on first paint if MediaPipe WASM takes >1s to load