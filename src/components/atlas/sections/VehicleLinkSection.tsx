tsx
"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { VehicleLinkPanelVM } from "@/lib/atlas/view-models-ardupilot";
import type { VehicleLinkChannel } from "@/lib/atlas/hooks-ardupilot";

type VehicleLinkSectionProps = {
  vm: VehicleLinkPanelVM;
  onPromotePath: (key: VehicleLinkChannel) => void;
};

export default function VehicleLinkSection({
  vm,
  onPromotePath
}: VehicleLinkSectionProps) {
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
                border: row.active
                  ? "1px solid rgba(34,211,238,0.35)"
                  : "1px solid rgba(148,163,184,0.14)",
                background: row.active
                  ? "rgba(34,211,238,0.08)"
                  : "rgba(15,23,42,0.45)",
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
                  <div style={{ color: "#f8fafc", fontWeight: 800 }}>
                    {row.label}
                  </div>
                  <div style={{ marginTop: 6, color: row.connected ? "#7ee787" : "#fda4af", fontSize: 13, fontWeight: 700 }}>
                    {row.connected ? "connected" : "offline"}
                  </div>
                  <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 13 }}>
                    Latency: {row.latencyLabel} · Loss: {row.packetLossLabel} · Signal: {row.signalLabel}
                  </div>
                </div>

                <button
                  onClick={() => onPromotePath(row.key as VehicleLinkChannel)}
                  disabled={!row.connected}
                  style={{
                    borderRadius: 12,
                    padding: "10px 12px",
                    border: row.connected
                      ? "1px solid rgba(34,211,238,0.35)"
                      : "1px solid rgba(148,163,184,0.12)",
                    background: row.connected
                      ? "rgba(34,211,238,0.12)"
                      : "rgba(51,65,85,0.4)",
                    color: row.connected ? "#67e8f9" : "#64748b",
                    fontWeight: 700,
                    cursor: row.connected ? "pointer" : "not-allowed"
                  }}
                >
                  Promote
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
