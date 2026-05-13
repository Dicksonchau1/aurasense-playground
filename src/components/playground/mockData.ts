import { ModeCardProps, SystemStatusItem, ActivityItem, CapabilityRow } from "./types";

export const modes: ModeCardProps[] = [
  {
    title: "Rehearse",
    description:
      "Clinical and professional skill rehearsal with guided performance feedback, structured sessions, and measurable skill review.",
    href: "/rehearse",
    stats: ["Guided sessions", "Performance review", "Nursing flows live"],
    ctaLabel: "Open Rehearse",
  },
  {
    title: "Drone / ATTAS",
    description:
      "ATTAS is the official AuraSense dashboard for mission planning, compliance-aware inspection workflows, and enterprise drone operations.",
    href: "/drone",
    badge: "Enterprise + Rehearse-3D",
    stats: ["ATTAS dashboard", "Compliance workflows", "Enterprise mission ops"],
    ctaLabel: "Open ATTAS",
  },
  {
    title: "Robotics",
    description:
      "Runtime substrate for physical-world perception, actuation loops, and robotics-facing operational interfaces.",
    href: "/robotics",
    stats: ["Runtime telemetry", "Perception loops", "NEPA integration"],
    ctaLabel: "Open Robotics Runtime",
  },
];

export const systemStatus: SystemStatusItem[] = [
  { label: "NEPA Runtime", value: "Online", tone: "good" },
  { label: "Supabase Sync", value: "Healthy", tone: "good" },
  { label: "Last Inference", value: "188 ms", tone: "neutral" },
  { label: "Signed Sessions (24h)", value: "42", tone: "neutral" },
  { label: "Deployment", value: "Jetson + Cloud", tone: "neutral" },
  { label: "Active Surface Count", value: "3", tone: "neutral" },
];

export const recentActivity: ActivityItem[] = [
  {
    title: "Handwash Session",
    category: "rehearse",
    timestamp: "08:12",
    status: "completed",
    href: "/rehearse/session/handwash",
  },
  {
    title: "ICC Tower Mission Draft",
    category: "drone",
    timestamp: "07:48",
    status: "review ready",
    href: "/drone/mission/icc-tower-draft",
  },
  {
    title: "Robotics Mock Telemetry Run",
    category: "robotics",
    timestamp: "07:22",
    status: "active",
    href: "/robotics/session/mock-telemetry",
  },
  {
    title: "Fall Risk Assessment Session",
    category: "rehearse",
    timestamp: "yesterday",
    status: "signed",
    href: "/rehearse/session/fall-risk",
  },
  {
    title: "Facade Route Replay",
    category: "drone",
    timestamp: "yesterday",
    status: "archived",
    href: "/drone/mission/facade-replay",
  },
];

export const capabilityRows: CapabilityRow[] = [
  {
    surface: "Rehearse",
    summary: "Human skill rehearsal and structured feedback",
    primaryUse: "Education / healthcare / professional training",
  },
  {
    surface: "ATTAS",
    summary: "Inspection mission planning and operational control",
    primaryUse: "Drone inspection / compliance / enterprise ops",
  },
  {
    surface: "Robotics",
    summary: "Runtime execution and physical-world control substrate",
    primaryUse: "Robotics / edge inference / automation",
  },
];
