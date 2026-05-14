"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { DecisionLedgerPanelVM } from "@/lib/atlas/view-models-ardupilot";

type DecisionLedgerSectionProps = {
  vm: DecisionLedgerPanelVM;
  onSelectEntry: (entryId: string) => void;
};

export default function DecisionLedgerSection({
  vm,
  onSelectEntry
}: DecisionLedgerSectionProps) {
  return (
    <AtlasSection title={vm.title} subtitle={vm.subtitle}>
      <AtlasStack>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {vm.chips.map((chip, index) => (
            <StatusChip key={`${chip.label}-${index}`} chip={chip} />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          {vm.kpis.map((item) => (
            <KpiCard key={item.key} item={item} compact />
          ))}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {vm.rows.map((row) => (
            <button
              key={row.id}
              onClick={() => onSelectEntry(row.id)}
              style={{
                textAlign: "left",
                borderRadius: 16,
                border: row.active
                  ? "1px solid rgba(34,211,238,0.35)"
                  : row.verdict === "blocked"
                    ? "1px solid rgba(239,68,68,0.22)"
                    : row.verdict === "advisory"
                      ? "1px solid rgba(245,158,11,0.22)"
                      : "1px solid rgba(34,197,94,0.22)",
                background: row.active ? "rgba(34,211,238,0.08)" : "rgba(15,23,42,0.45)",
                padding: 14,
                cursor: "pointer"
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
                <div>
                  <div style={{ color: "#f8fafc", fontWeight: 800 }}>{row.actionLabel}</div>
                  <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 12 }}>
                    {row.ts} · {row.actor} · {row.decisionType}
                  </div>
                  <div style={{ marginTop: 8, color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>
                    {row.rationale}
                  </div>
                  <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
                    Evidence ref: {row.evidenceRef}
                  </div>
                </div>
                <div style={{ color: verdictColor(row.verdict), fontSize: 12, fontWeight: 700 }}>
                  {row.verdict}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ color: "#94a3b8", fontSize: 12 }}>{vm.lastAck}</div>
      </AtlasStack>
    </AtlasSection>
  );
}

function verdictColor(verdict: string) {
  if (verdict === "blocked") return "#fda4af";
  if (verdict === "advisory") return "#f7c56b";
  return "#7ee787";
}
