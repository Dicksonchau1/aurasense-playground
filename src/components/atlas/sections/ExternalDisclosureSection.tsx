"use client";

import {
  useArduPilotExternalDisclosure
} from "@/src/lib/atlas/hooks-ardupilot";
import {
  getExternalDisclosurePanelVM
} from "@/src/lib/atlas/view-models-ardupilot";

type ExternalDisclosureSectionProps = {
  className?: string;
  titleOverride?: string;
  hideActions?: boolean;
  onSetDisclosureStatus?: (id: string, status: string) => void;
  onSelectDisclosure?: (id: string) => void;
  selectedDisclosureId?: string;
};

function toneClass(tone: string) {
  if (tone === "critical") return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30";
  if (tone === "warning") return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
  if (tone === "success") return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
  if (tone === "accent") return "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30";
  return "bg-white/5 text-white/70 ring-1 ring-white/10";
}

export function ExternalDisclosureSection({
  className,
  titleOverride,
  hideActions,
  onSetDisclosureStatus,
  onSelectDisclosure,
  selectedDisclosureId
}: ExternalDisclosureSectionProps) {
  const {
    state,
    selectedDisclosure,
    selectDisclosure,
    setDisclosureStatus
  } = useArduPilotExternalDisclosure();

  // Allow external control of selection
  const effectiveSelectedDisclosure = selectedDisclosureId
    ? state.disclosures.find((d: any) => d.id === selectedDisclosureId) || selectedDisclosure
    : selectedDisclosure;
  const vm = getExternalDisclosurePanelVM(state, effectiveSelectedDisclosure);

  return (
    <section className={className} aria-label="External Disclosure Section">
      <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              AuditShell / disclosure posture
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{titleOverride || vm.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
              {vm.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {vm.chips.map((chip) => (
              <span
                key={chip.label}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${toneClass(chip.tone)}`}
                aria-label={`Status: ${chip.label}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {vm.kpis.map((kpi) => (
              <div key={kpi.key} className="rounded-2xl border border-white/10 bg-white/5 p-4" aria-label={`KPI: ${kpi.label}`}>
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
              <button
                key={row.id}
                type="button"
                aria-label={`Select disclosure ${row.label}`}
                onClick={() => (onSelectDisclosure ? onSelectDisclosure(row.id) : selectDisclosure(row.id))}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  row.active
                    ? "border-cyan-400/35 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{row.label}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                      {row.recipient} · {row.disclosureType} · {row.responsibleRole}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${toneClass(
                      row.status === "blocked"
                        ? "critical"
                        : row.status === "review" || row.status === "draft"
                          ? "warning"
                          : row.status === "submitted" || row.status === "ready"
                            ? "success"
                            : "neutral"
                    )}`}
                    aria-label={`Status: ${row.status}`}
                  >
                    {row.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/64">{row.contentSummary}</p>
                <p className="mt-3 text-xs text-white/45">Due: {row.dueLabel}</p>
              </button>
            ))}
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Selected disclosure
              </p>
              {vm.selectedDisclosure ? (
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                  <p className="text-white">{vm.selectedDisclosure.label}</p>
                  <p>Recipient: {vm.selectedDisclosure.recipient}</p>
                  <p>Type: {vm.selectedDisclosure.disclosureType}</p>
                  <p>Status: {vm.selectedDisclosure.status}</p>
                  <p>Evidence: {vm.selectedDisclosure.evidenceRef}</p>
                  <p>Summary: {vm.selectedDisclosure.contentSummary}</p>
                  <p>Due: {vm.selectedDisclosure.dueLabel}</p>
                  <p>Submitted: {vm.selectedDisclosure.submittedAt ?? "not yet"}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/55">
                  Select a disclosure item to inspect routing and posture.
                </p>
              )}
            </div>
            {vm.selectedDisclosure && !hideActions ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Status actions
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["draft", "review", "ready", "submitted", "blocked"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      aria-label={`Set status ${status}`}
                      onClick={() => (onSetDisclosureStatus ? onSetDisclosureStatus(vm.selectedDisclosure!.id, status) : setDisclosureStatus(vm.selectedDisclosure!.id, status))}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/55">{vm.lastAck}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
