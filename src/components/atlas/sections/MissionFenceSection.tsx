"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { MissionFencePanelVM } from "@/lib/atlas/view-models-ardupilot";
import type { MissionFenceState } from "@/lib/atlas/hooks-ardupilot";

type MissionFenceSectionProps = {
  vm: MissionFencePanelVM;
  onSetAutoResponse: (action: MissionFenceState["autoResponse"]) => void;
};

const AUTO_RESPONSES: MissionFenceState["autoResponse"][] = [
  "warn",
  "hold",
  "rtl",
  "land"
];

export default function MissionFenceSection({
  vm,
  onSetAutoResponse
}: MissionFenceSectionProps) {
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {AUTO_RESPONSES.map((action) => (
            <button
              key={action}
              onClick={() => onSetAutoResponse(action)}
              style={{
                borderRadius: 12,
                padding: "10px 14px",
                border:
                  vm.autoResponse === action
                    ? "1px solid rgba(34,211,238,0.35)"
                    : "1px solid rgba(148,163,184,0.18)",
                background:
                  vm.autoResponse === action
                    ? "rgba(34,211,238,0.12)"
                    : "rgba(15,23,42,0.72)",
                color: vm.autoResponse === action ? "#67e8f9" : "#e2e8f0",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase"
              }}
            >
              {action}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {vm.rows.map((row) => (
            <div
              key={row.id}
              style={{
                borderRadius: 16,
                border:
                  row.state === "breach"
                    ? "1px solid rgba(239,68,68,0.22)"
                    : row.state === "warning"
                      ? "1px solid rgba(245,158,11,0.22)"
                      : "1px solid rgba(148,163,184,0.14)",
                background: "rgba(15,23,42,0.45)",
                padding: 14
              }}
            >
              <div style={{ color: "#f8fafc", fontWeight: 800 }}>{row.label}</div>
              <div style={{ marginTop: 6, color: zoneColor(row.state), fontSize: 13, fontWeight: 700 }}>
                {row.state}
              </div>
              <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 13 }}>
                Margin: {row.marginLabel}
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: "#94a3b8", fontSize: 12 }}>{vm.lastAck}</div>
      </AtlasStack>
    </AtlasSection>
  );
}

function zoneColor(state: string) {
  if (state === "breach") return "#fda4af";
  if (state === "warning") return "#f7c56b";
  return "#7ee787";
}
