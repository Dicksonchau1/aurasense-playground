import { Card } from "@/components/ui/Card";

const GATE_LABELS: Record<string, { label: string; unit?: string }> = {
  safety:          { label: "Safety",           unit: "coll/1k" },
  mission_success: { label: "Mission success",  unit: "%"       },
  perception:      { label: "Perception",       unit: "ΔmAP"    },
  control:         { label: "Control",          unit: "° tilt"  },
  robustness:      { label: "Robustness (5%)",  unit: "%"       },
  sim_to_real:     { label: "Sim-to-real",      unit: "% MAE"   },
};

export function GatesPanel({ gates }: { gates: Record<string, any> }) {
  return (
    <Card title="🛡 Promote-to-Fleet gates">
      <div className="grid grid-cols-6 gap-3">
        {Object.entries(gates).map(([id, g]: any) => (
          <div key={id} className={`rounded-xl border p-3 ${g.passed
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-rose-500/40 bg-rose-500/5"}`}>
            <div className="text-xs uppercase text-zinc-500">{GATE_LABELS[id]?.label ?? id}</div>
            <div className="mt-1 text-lg font-semibold text-zinc-100 tabular-nums">
              {g.value.toFixed(2)} <span className="text-xs text-zinc-500">{GATE_LABELS[id]?.unit}</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              threshold {g.op} {g.threshold}
            </div>
            <div className={`mt-2 text-xs font-medium ${g.passed ? "text-emerald-400" : "text-rose-400"}`}>
              {g.passed ? "✓ PASS" : "✗ FAIL"}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
