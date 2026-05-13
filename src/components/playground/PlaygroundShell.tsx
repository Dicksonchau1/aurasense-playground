
import { ModeCard } from "./ModeCard";
import { SystemStatusBar } from "./SystemStatusBar";
import { RecentSessionsPanel } from "./RecentSessionsPanel";
import { CapabilityMatrix } from "./CapabilityMatrix";
import type { ModeCardProps, SystemStatusItem, ActivityItem, CapabilityRow } from "./types";

export default function PlaygroundShell({
  modes,
  systemStatus,
  recentActivity,
  capabilityRows,
}: {
  modes: ModeCardProps[];
  systemStatus: SystemStatusItem[];
  recentActivity: ActivityItem[];
  capabilityRows: CapabilityRow[];
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* SECTION A — Hero / Shell Intro */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">AuraSense Playground</h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
          AuraSense unifies rehearsal, mission operations, and physical-world runtime in one operational platform.
        </p>
        <div className="flex flex-wrap gap-3 mb-2">
          <a href="/rehearse" className="px-4 py-2 rounded bg-cyan-700 text-white font-medium hover:bg-cyan-800 transition">Open Rehearse</a>
          <a href="/drone" className="px-4 py-2 rounded bg-cyan-700 text-white font-medium hover:bg-cyan-800 transition">Open ATTAS</a>
          <a href="/robotics" className="px-4 py-2 rounded bg-cyan-700 text-white font-medium hover:bg-cyan-800 transition">Open Robotics Runtime</a>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Realtime rehearsal, mission planning, and runtime observability from one operational surface.
        </div>
      </section>

      {/* SECTION B — Mode Cards */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode, i) => (
          <ModeCard key={i} {...mode} />
        ))}
      </section>

      {/* SECTION C — System Status */}
      <section className="mb-8">
        <SystemStatusBar items={systemStatus} />
      </section>

      {/* SECTION D/E — Recent Activity + Capability Matrix */}
      <section className="mb-8 grid md:grid-cols-2 gap-6">
        <RecentSessionsPanel items={recentActivity} />
        <CapabilityMatrix rows={capabilityRows} />
      </section>

      {/* SECTION F — ATTAS Enterprise Positioning */}
      <section className="mt-10">
        <h4 className="text-md font-semibold mb-2 text-neutral-800 dark:text-neutral-200">ATTAS Enterprise Positioning</h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
          ATTAS is the official dashboard frontend for enterprise drone operations. Rehearse-3D is available exclusively in ATTAS Enterprise as the 3D rehearsal layer and midpoint to fuller automation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="font-semibold mb-1">ATTAS Core</div>
            <div className="text-xs text-neutral-700 dark:text-neutral-300">Structured mission planning and operational safety baseline</div>
          </div>
          <div className="border rounded p-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="font-semibold mb-1">ATTAS Pro</div>
            <div className="text-xs text-neutral-700 dark:text-neutral-300">Richer planning depth, analytics, and inspection workflow control</div>
          </div>
          <div className="border rounded p-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="font-semibold mb-1">ATTAS Enterprise</div>
            <div className="text-xs text-neutral-700 dark:text-neutral-300">Everything in Pro plus <span className="font-bold">Rehearse-3D</span> and advanced enterprise simulation capability</div>
          </div>
        </div>
      </section>
    </main>
  );
}
