tsx
"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasSplit, AtlasStack } from "@/components/atlas/layout";
import type { PolicyReceiptPanelVM } from "@/lib/atlas/view-models-ardupilot";

type PolicyReceiptSectionProps = {
  vm: PolicyReceiptPanelVM;
  onSelectReceipt: (receiptId: string) => void;
};

export default function PolicyReceiptSection({
  vm,
  onSelectReceipt
}: PolicyReceiptSectionProps) {
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

        <AtlasSplit
          left={
            <div style={{ display: "grid", gap: 10 }}>
              {vm.rows.map((row) => (
                <button
                  key={row.id}
                  onClick={() => onSelectReceipt(row.id)}
                  style={{
                    borderRadius: 14,
                    border: row.active
                      ? "1px solid rgba(34,211,238,0.35)"
                      : "1px solid rgba(148,163,184,0.14)",
                    background: row.active
                      ? "rgba(34,211,238,0.10)"
                      : "rgba(15,23,42,0.45)",
                    padding: 12,
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: 13 }}>
                      {row.policyName}
                    </div>
                    <div style={{ color: outcomeColor(row.outcome), fontSize: 12, fontWeight: 700 }}>
                      {row.outcome}
                    </div>
                  </div>
                  <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>
                    {row.reason}
                  </div>
                  <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
                    {row.ts} · {row.evidenceHash}
                  </div>
                </button>
              ))}
            </div>
          }
          right={
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
                  fontWeight: 700
                }}
              >
                Selected receipt
              </div>

              {vm.selectedReceipt ? (
                <>
                  <div style={{ marginTop: 10, color: "#f8fafc", fontWeight: 800, fontSize: 16 }}>
                    {vm.selectedReceipt.policyName}
                  </div>
                  <div style={{ marginTop: 8, color: outcomeColor(vm.selectedReceipt.outcome), fontSize: 13, fontWeight: 700 }}>
                    {vm.selectedReceipt.outcome}
                  </div>
                  <div style={{ marginTop: 10, color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>
                    {vm.selectedReceipt.reason}
                  </div>
                  <div style={{ marginTop: 14, color: "#94a3b8", fontSize: 13 }}>
                    Timestamp: {vm.selectedReceipt.ts}
                  </div>
                  <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 13 }}>
                    Evidence hash: {vm.selectedReceipt.evidenceHash}
                  </div>
                  <div style={{ marginTop: 6, color: severityColor(vm.selectedReceipt.severity), fontSize: 13 }}>
                    Severity: {vm.selectedReceipt.severity}
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 10, color: "#94a3b8" }}>No receipt selected.</div>
              )}
            </div>
          }
        />

        <div style={{ color: "#94a3b8", fontSize: 12 }}>{vm.lastAck}</div>
      </AtlasStack>
    </AtlasSection>
  );
}

function outcomeColor(outcome: string) {
  if (outcome === "blocked") return "#fda4af";
  if (outcome === "advisory") return "#f7c56b";
  return "#7ee787";
}

function severityColor(severity: "info" | "warning" | "critical") {
  if (severity === "critical") return "#fda4af";
  if (severity === "warning") return "#f7c56b";
  return "#93c5fd";
}
