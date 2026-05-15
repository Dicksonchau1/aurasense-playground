"use client";

import {
  getStakeholderBriefPanelVM
} from "@/src/lib/atlas/view-models-ardupilot";
import {
  useArduPilotStakeholderBrief
} from "@/src/lib/atlas/hooks-ardupilot";

type StakeholderBriefSectionProps = {
  className?: string;
};

function toneClass(tone: string) {
  if (tone === "critical") return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30";
  if (tone === "warning") return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
  if (tone === "success") return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
  if (tone === "accent") return "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30";
  return "bg-white/5 text-white/70 ring-1 ring-white/10";
}

export function StakeholderBriefSection({
  className
}: StakeholderBriefSectionProps) {
  const {
    state,
    setAudience
  } = useArduPilotStakeholderBrief();

  const vm = getStakeholderBriefPanelVM(state);

  return (
    <section className={className}>
      <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              AuditShell / stakeholder narrative
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {vm.title}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-white/65">
              {vm.subtitle}
            </p>
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

          <div className="flex flex-wrap gap-2">
            {vm.audienceOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setAudience(option.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  option.active
                    ? "border border-cyan-400/35 bg-cyan-400/10 text-cyan-200"
                    : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
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

        <div className="grid gap-6 pt-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Headline
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-tight text-white">
                {vm.headline}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/66">
                {vm.executiveNarrative}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Key points
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                  {vm.keyPoints.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Risks
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                  {vm.risks.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Decisions
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                  {vm.decisions.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Compliance notes
                </p>
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                  {vm.complianceNotes.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Evidence summary
              </p>
              <p className="mt-4 text-sm leading-7 text-white/66">
                {vm.evidenceSummary}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Recommended actions
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-white/66">
                {vm.recommendedActions.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Synchronization
              </p>
              <p className="mt-4 text-sm leading-7 text-white/60">{vm.lastAck}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
