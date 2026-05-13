// Shared types for AuraSense Playground

export type ModeCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  stats: string[];
  ctaLabel: string;
};

export type SystemStatusItem = {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warning";
};

export type ActivityItem = {
  title: string;
  category: "rehearse" | "drone" | "robotics";
  timestamp: string;
  status: string;
  href?: string;
};

export type CapabilityRow = {
  surface: string;
  summary: string;
  primaryUse: string;
};
