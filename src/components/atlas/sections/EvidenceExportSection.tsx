"use client";

import {
  useArduPilotEvidenceExport
} from "@/src/lib/atlas/hooks-ardupilot";
import {
  getEvidenceExportPanelVM
} from "@/src/lib/atlas/view-models-ardupilot";

type EvidenceExportSectionProps = {
  className?: string;
};

function toneClass(tone: string) {
  if (tone === "critical") return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30";
  if (tone === "warning") return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
type EvidenceExportSectionProps = {
  className?: string;
  titleOverride?: string;
  hideActions?: boolean;
  onSignExport?: () => void;
  onExportPackage?: () => void;
  onSelectArtifact?: (id: string) => void;
  onToggleArtifactIncluded?: (id: string) => void;
  onMarkArtifactReady?: (id: string) => void;
  onSetDestinationChannel?: (channel: string) => void;
  selectedArtifactId?: string;
  destinationChannel?: string;
};
  return "bg-white/5 text-white/70 ring-1 ring-white/10";
export function EvidenceExportSection({
  className,
  titleOverride,
  hideActions,
  onSignExport,
  onExportPackage,
  onSelectArtifact,
  onToggleArtifactIncluded,
  onMarkArtifactReady,
  onSetDestinationChannel,
  selectedArtifactId,
  destinationChannel
}: EvidenceExportSectionProps) {

export function EvidenceExportSection({ className }: EvidenceExportSectionProps) {
  const {
    state,
    selectedArtifact,
    selectArtifact,
    toggleArtifactIncluded,
    setDestinationChannel,
    signExportPackage,
    markArtifactReady,
    exportPackage
  } = useArduPilotEvidenceExport();

  const vm = getEvidenceExportPanelVM(state, selectedArtifact);

  return (
    <section className={className}>
      <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                AuditShell / outbound package
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{vm.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
                {vm.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["internal-archive", "client-package", "regulatory-package", "partner-brief"] as const).map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setDestinationChannel(channel)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    vm.destinationChannel === channel
                      ? "border border-cyan-400/35 bg-cyan-400/10 text-cyan-200"
                      : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/10"
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {vm.chips.map((chip) => (
              <span
                key={chip.label}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${toneClass(chip.tone)}`}
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {vm.kpis.map((kpi) => (
              <div key={kpi.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{kpi.label}</p>
                <div className="mt-2 text-xl font-semibold text-white">{kpi.value}</div>
                <p className="mt-1 text-sm text-white/55">{kpi.sublabel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 pt-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-3">
            {vm.rows.map((row) => (
              <div
                key={row.id}
                className={`rounded-2xl border p-4 ${
                  row.active
                    ? "border-cyan-400/35 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => selectArtifact(row.id)}
                    className="text-left"
                  >
                    <h3 className="text-sm font-semibold text-white">{row.label}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                      {row.kind} · {row.bytesLabel}
                    </p>
                  </button>

                  <label className="flex items-center gap-2 text-xs text-white/60">
                    <input
                      type="checkbox"
                      checked={row.included}
                      onChange={() => toggleArtifactIncluded(row.id)}
                    />
                    include
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${toneClass(
                      row.status === "blocked"
                        ? "critical"
                        : row.status === "pending"
                          ? "warning"
                          : "success"
                    )}`}
                  >
                    {row.status}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
                    {row.checksum}
                  </span>
                </div>

                {row.status !== "ready" && row.included ? (
                  <button
                    type="button"
                    onClick={() => markArtifactReady(row.id)}
                    className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200"
                  >
                    Mark ready
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Package detail
              </p>
              {vm.selectedArtifact ? (
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                  <p className="text-white">{vm.selectedArtifact.label}</p>
                  <p>Kind: {vm.selectedArtifact.kind}</p>
                  <p>Status: {vm.selectedArtifact.status}</p>
                  <p>Checksum: {vm.selectedArtifact.checksum}</p>
                  <p>Included: {vm.selectedArtifact.included ? "yes" : "no"}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/55">
                  Select an artifact to inspect its export status.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Outbound actions
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={signExportPackage}
                  className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200"
                >
                  Sign package
                </button>
                <button
                  type="button"
                  onClick={exportPackage}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                >
                  Export package
                </button>
              </div>
              <p className="mt-4 text-sm text-white/55">{vm.lastAck}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
