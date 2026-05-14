"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { RecoveryActionsPanelVM } from "@/lib/atlas/view-models-ardupilot";
import type { RecoveryActionKey } from "@/lib/atlas/hooks-ardupilot";

type RecoveryActionsSectionProps = {
  vm: RecoveryActionsPanelVM;
  onIssueAction: (key: RecoveryActionKey) => void;
};

export default function RecoveryActionsSection({
  vm,
  onIssueAction
}: RecoveryActionsSectionProps) {
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
            <div
              key={row.key}
              style={{
                borderRadius: 16,
                border:
                  row.dangerLevel === "critical"
                    ? "1px solid rgba(239,68,68,0.22)"
                    : row.dangerLevel === "high"
                      ? "1px solid rgba(245,158,11,0.22)"
                      : "1px solid rgba(148,163,184,0.14)",
                background: "rgba(15,23,42,0.45)",
                padding: 14
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ color: "#f8fafc", fontWeight: 800 }}>{row.label}</div>
                  <div style={{ marginTop: 6, color: dangerColor(row.dangerLevel), fontSize: 13, fontWeight: 700 }}>
                    {row.dangerLevel}
                  </div>
                  <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>
                    {row.description}
                  </div>
                  <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 12 }}>
                    {row.requiresConfirm ? "Confirmation required" : "Immediate action allowed"}
                  </div>
                </div>

                <button
                  onClick={() => onIssueAction(row.key as RecoveryActionKey)}
                  disabled={!row.available}
                  style={{
                    borderRadius: 12,
                    padding: "10px 12px",
                    border: row.available
                      ? "1px solid rgba(34,211,238,0.35)"
                      : "1px solid rgba(148,163,184,0.12)",
                    background: row.available
                      ? "rgba(34,211,238,0.12)"
                      : "rgba(51,65,85,0.4)",
                    color: row.available ? "#67e8f9" : "#64748b",
                    fontWeight: 700,
                    cursor: row.available ? "pointer" : "not-allowed"
                  }}
                >
                  Issue
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: "#94a3b8", fontSize: 12 }}>{vm.lastAck}</div>
      </AtlasStack>
    </AtlasSection>
  );
}

function dangerColor(level: string) {
  if (level === "critical") return "#fda4af";
  if (level === "high") return "#f7c56b";
  return "#93c5fd";
}
