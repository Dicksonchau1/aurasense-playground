// Canonical copy. Language discipline:
//   ALLOWED:   anomaly, consistency, coherence, cross-check, envelope, practice
//   FORBIDDEN: deception, lie, truth, emotion, honesty, confidence score
// Audience: candidate. Never employer/recruiter framing.

export const COPY = {
  brand: "AuraSense",
  productRehearse: "Aura Rehearse",
  productNepa: "NEPA Playground",

  rehearse: {
    breadcrumb: ["NEPA Playground", "Rehearse"],
    headline: "Rehearse Playground",
    subhead:
      "Practice on-camera. See your envelope and consistency in real time. Nothing leaves your device.",
    startCta: "Start Rehearsal",
    startHint: "⌘↵",
    privacy: "Nothing leaves your device on Rehearse.",
    envelopeLabel: "Envelope",
    consistencyLabel: "Consistency",
    laneLabels: {
      pace: "Pace coherence",
      pitch: "Pitch coherence",
      stillness: "Postural stillness",
      gaze: "Gaze cross-check",
    },
    runningCta: "Stop",
  },

  drone: {
    breadcrumb: ["NEPA Playground", "Drone"],
    headline: "Drone Playground",
    subhead:
      "Live AI overlay on any camera. Webcam coming V0.5 — RTSP / SRT / LiDAR coming V1.",
    privacy: "Inference runs in your browser. No video is uploaded.",
    startCta: "Start Stream",
    startHint: "⌘↵",
    placeholder: "Webcam + YOLO overlay arrives in V0.5.",
  },

  membership: {
    title: "Premium lane",
    subtitle:
      "This lane is part of an upcoming tier. We'll open enrolment when V1 ships.",
    tiers: [
      {
        name: "Practice",
        price: "Free",
        notes: "Rehearse + Drone webcam. Save and share.",
      },
      {
        name: "Pro",
        price: "Coming V1",
        notes: "RTSP / SRT ingest, IMU, polygon zones, longer history.",
      },
      {
        name: "Enterprise",
        price: "Coming V1",
        notes: "Multi-stream, MBIS export, on-prem inference.",
      },
    ],
    cta: "Notify me when this opens",
  },

  nav: {
    primary: [
      { id: "rehearse", label: "Rehearse", href: "/rehearse", lock: false },
      { id: "drone", label: "Drone", href: "/drone", lock: false },
    ],
    locked: [
      { id: "avatar", label: "Aura Avatar", note: "V2" },
      { id: "mbis", label: "MBIS Export", note: "Enterprise" },
    ],
  },

  footer: "playground.aurasensehk.com",
} as const;
