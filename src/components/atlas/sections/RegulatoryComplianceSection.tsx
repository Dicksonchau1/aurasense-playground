"use client";

import {
  getRegulatoryCompliancePanelVM
} from "@/src/lib/atlas/view-models-ardupilot";
import {
  useArduPilotRegulatoryCompliance
} from "@/src/lib/atlas/hooks-ardupilot";

type RegulatoryComplianceSectionProps = {
  className?: string;
};

function toneClass(tone: string) {
  if (tone === "critical") return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30";
  if (tone === "warning") return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
  if (tone === "success") return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
  if (tone === "accent") return "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30";
  return "bg-white/5 text-white/70 ring-1 ring-white/10";
}

export function RegulatoryComplianceSection({
  className
}: RegulatoryComplianceSectionProps) {
  const {
    state,
    selectedControl,
    selectControl,
    signComplianceExport
  } = useArduPilotRegulatoryCompliance();

  const vm = getRegulatoryCompliancePanelVM(state, selectedControl);

  return (
    <section className={className}>
      <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                AuditShell / compliance rail
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {vm.title}
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-white/65">
                {vm.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={signComplianceExport}
              className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15"
            >
              Sign compliance export
            </button>
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
              <div
                key={kpi.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {kpi.label}
                </p>
                <div className="mt-2 text-xl font-semibold text-white">{kpi.value}</div>
                <p className="mt-1 text-sm text-white/55">{kpi.sublabel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 pt-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-3">
            {vm.rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => selectControl(row.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  row.active
                    ? "border-cyan-400/35 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{row.label}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${toneClass(
                          row.status === "fail"
                            ? "critical"
                            : row.status === "watch"
                              ? "warning"
                              : "success"
                        )}`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                      {row.frameworkRef} · owner {row.owner}
                    </p>
                  </div>

                  <div className="text-right text-xs text-white/45">
                    <div>Checked</div>
                    <div>{row.lastCheckedAt}</div>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-white/62">{row.note}</p>
                <p className="mt-3 text-xs text-cyan-200/85">
                  Evidence: {row.evidenceRef}
                </p>
              </button>
            ))}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Selected control
            </p>

            {vm.selectedControl ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {vm.selectedControl.label}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">
                    {vm.selectedControl.frameworkRef} · {vm.selectedControl.owner}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${toneClass(
                      vm.selectedControl.status === "fail"
                        ? "critical"
                        : vm.selectedControl.status === "watch"
                          ? "warning"
                          : "success"
                    )}`}
                  >
                    {vm.selectedControl.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${toneClass(
                      vm.selectedControl.severity === "critical"
                        ? "critical"
                        : vm.selectedControl.severity === "warning"
                          ? "warning"
                          : "info"
                    )}`}
                  >
                    {vm.selectedControl.severity}
                  </span>
                </div>

                <div className="space-y-2 text-sm leading-6 text-white/68">
                  <p>{vm.selectedControl.note}</p>
                  <p>
                    <span className="text-white/42">Evidence:</span>{" "}
                    {vm.selectedControl.evidenceRef}
                  </p>
                  <p>
                    <span className="text-white/42">Checked:</span>{" "}
                    {vm.selectedControl.lastCheckedAt}
                  </p>
                  <p>
                    <span className="text-white/42">Exportable:</span>{" "}
                    {vm.selectedControl.exportable ? "yes" : "no"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/55">
                Select a compliance control to inspect its evidence and operational note.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
