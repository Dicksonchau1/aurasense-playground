"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { TelemetryHealthPanelVM } from "@/lib/atlas/view-models-ardupilot";

type TelemetryHealthSectionProps = {
  vm: TelemetryHealthPanelVM;
};

export default function TelemetryHealthSection({
  vm
}: TelemetryHealthSectionProps) {
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

        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.14)",
            background: "rgba(15,23,42,0.45)",
            padding: 14
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
              marginBottom: 10
            }}
          >
            Health verdict
          </div>

          <div
            style={{
              color: verdictColor(vm.verdictTone),
              fontSize: 20,
              fontWeight: 800
            }}
          >
            {vm.verdictLabel}
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {vm.warnings.length ? (
              vm.warnings.map((warning, index) => (
                <div
                  key={`${warning}-${index}`}
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(245,158,11,0.22)",
                    background: "rgba(245,158,11,0.08)",
                    color: "#f7c56b",
                    padding: "10px 12px",
                    fontSize: 13
                  }}
                >
                  {warning}
                </div>
              ))
            ) : (
              <div
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(63,185,80,0.20)",
                  background: "rgba(63,185,80,0.08)",
                  color: "#7ee787",
                  padding: "10px 12px",
                  fontSize: 13
                }}
              >
                No active telemetry warnings. Vehicle health is within preferred envelope.
              </div>
            )}
          </div>
        </div>
      </AtlasStack>
    </AtlasSection>
  );
}

function verdictColor(tone: TelemetryHealthPanelVM["verdictTone"]) {
  switch (tone) {
    case "success":
      return "#7ee787";
    case "warning":
      return "#f7c56b";
    case "critical":
      return "#fda4af";
    case "accent":
      return "#67e8f9";
    case "info":
      return "#93c5fd";
    case "neutral":
    default:
      return "#e2e8f0";
  }
}
