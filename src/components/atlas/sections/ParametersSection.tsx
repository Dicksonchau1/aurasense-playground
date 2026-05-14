"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { ParametersPanelVM } from "@/lib/atlas/view-models-ardupilot";
"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { ParametersPanelVM } from "@/lib/atlas/view-models-ardupilot";

type ParametersSectionProps = {
  vm: ParametersPanelVM;
  onCategoryChange: (category: ParametersPanelVM["categories"][number]["key"]) => void;
  onQueryChange: (query: string) => void;
  onStageChange: (key: string, nextValue: string) => void;
  onApply: (key: string) => void;
  onReset: (key: string) => void;
};

export default function ParametersSection({
  vm,
  onCategoryChange,
  onQueryChange,
  onStageChange,
  onApply,
  onReset
}: ParametersSectionProps) {
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
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center"
          }}
        >
          {vm.categories.map((category) => (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              style={{
                borderRadius: 999,
                padding: "8px 12px",
                border: category.active
                  ? "1px solid rgba(34,211,238,0.35)"
                  : "1px solid rgba(148,163,184,0.18)",
                background: category.active
                  ? "rgba(34,211,238,0.12)"
                  : "rgba(15,23,42,0.72)",
                color: category.active ? "#67e8f9" : "#cbd5e1",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {category.label}
            </button>
          ))}

          <input
            value={vm.query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search parameters"
            style={{
              marginLeft: "auto",
              minWidth: 220,
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.72)",
              color: "#e2e8f0",
              padding: "10px 12px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {vm.rows.map((row) => (
            <div
              key={row.key}
              style={{
                borderRadius: 16,
                border: row.dirty
                  ? "1px solid rgba(245,158,11,0.28)"
                  : "1px solid rgba(148,163,184,0.14)",
                background: "rgba(15,23,42,0.45)",
                padding: 14
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.15fr 0.8fr 1fr auto",
                  gap: 14,
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{row.label}</div>
                  <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 12 }}>
                    {row.key} · {row.category}
                  </div>
                  <div style={{ marginTop: 8, color: "#cbd5e1", fontSize: 13 }}>
                    {row.description}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>
                    Live value
                  </div>
                  <div style={{ marginTop: 4, color: "#e2e8f0", fontWeight: 700 }}>
                    {row.valueText}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>
                    Pending value
                  </div>
                  {row.liveEditable ? (
                    <input
                      defaultValue={row.pendingText ?? row.valueText}
                      onBlur={(e) => onStageChange(row.key, e.target.value)}
                      style={{
                        marginTop: 4,
                        width: "100%",
                        borderRadius: 12,
                        border: "1px solid rgba(148,163,184,0.18)",
                        background: "rgba(2,6,23,0.72)",
                        color: "#e2e8f0",
                        padding: "10px 12px",
                        outline: "none"
                      }}
                    />
                  ) : (
                    <div style={{ marginTop: 4, color: "#94a3b8" }}>Read-only</div>
                  )}
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <button
                    disabled={!row.liveEditable}
                    onClick={() => onApply(row.key)}
                    style={buttonStyle("primary", !row.liveEditable)}
                  >
                    Apply
                  </button>
                  <button
                    disabled={!row.liveEditable}
                    onClick={() => onReset(row.key)}
                    style={buttonStyle("secondary", !row.liveEditable)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!vm.rows.length ? (
            <div style={{ color: "#94a3b8" }}>No parameters match the current filter.</div>
          ) : null}
        </div>

        <div style={{ color: "#94a3b8", fontSize: 12 }}>{vm.lastAck}</div>
      </AtlasStack>
    </AtlasSection>
  );
}

function buttonStyle(kind: "primary" | "secondary", disabled = false): React.CSSProperties {
  if (kind === "primary") {
    return {
      borderRadius: 12,
      padding: "10px 12px",
      border: "1px solid rgba(34,211,238,0.35)",
      background: "rgba(34,211,238,0.12)",
      color: "#67e8f9",
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1
    };
  }

  return {
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    color: "#e2e8f0",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1
  };
}
