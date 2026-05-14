"use client";

import { KpiCard, StatusChip } from "@/components/atlas";
import { AtlasSection, AtlasStack } from "@/components/atlas/layout";
import type { MissionDebriefState, MissionDebriefTag } from "@/lib/atlas/hooks-ardupilot";
import type { MissionDebriefPanelVM } from "@/lib/atlas/view-models-ardupilot";

type MissionDebriefSectionProps = {
  vm: MissionDebriefPanelVM;
  state: MissionDebriefState;
  onSetDebriefStatus: (value: MissionDebriefState["debriefStatus"]) => void;
  onSetOverallAssessment: (value: MissionDebriefState["overallAssessment"]) => void;
  onSetSelectedTag: (value: MissionDebriefTag) => void;
  onSetOperatorReflection: (value: string) => void;
};

const DEBRIEF_STATUSES: MissionDebriefState["debriefStatus"][] = ["draft", "reviewed", "locked"];
const ASSESSMENTS: MissionDebriefState["overallAssessment"][] = ["strong", "mixed", "weak"];

export default function MissionDebriefSection({
  vm,
  state,
  onSetDebriefStatus,
  onSetOverallAssessment,
  onSetSelectedTag,
  onSetOperatorReflection
}: MissionDebriefSectionProps) {
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
          {DEBRIEF_STATUSES.map((status) => (
            <button
              key={status}
              style={buttonStyle(state.debriefStatus === status)}
              onClick={() => onSetDebriefStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {ASSESSMENTS.map((assessment) => (
            <button
              key={assessment}
              style={buttonStyle(state.overallAssessment === assessment)}
              onClick={() => onSetOverallAssessment(assessment)}
            >
              {assessment}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {vm.tags.map((tag) => (
            <button
              key={tag.key}
              style={buttonStyle(tag.active)}
              onClick={() => onSetSelectedTag(tag.key)}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16
          }}
        >
          <InfoListCard title="What went well" items={vm.whatWentWell} tone="success" />
          <InfoListCard title="Needs attention" items={vm.whatNeedsAttention} tone="warning" />
        </div>

        <InfoListCard title="Next actions" items={vm.nextActions} tone="info" />

        <label
          style={{
            display: "grid",
            gap: 8,
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.14)",
            background: "rgba(15,23,42,0.45)",
            padding: 14
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: 12 }}>Operator reflection</div>
          <textarea
            value={state.operatorReflection}
            onChange={(e) => onSetOperatorReflection(e.target.value)}
            rows={5}
            style={textareaStyle()}
          />
        </label>

        <div style={{ color: "#94a3b8", fontSize: 12 }}>{vm.lastAck}</div>
      </AtlasStack>
    </AtlasSection>
  );
}

function InfoListCard({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "success" | "warning" | "info";
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.14)",
        background: "rgba(15,23,42,0.45)",
        padding: 14
      }}
    >
      <div style={{ color: "#f8fafc", fontWeight: 800 }}>{title}</div>
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              borderRadius: 12,
              border: `1px solid ${toneBorder(tone)}`,
              background: "rgba(15,23,42,0.62)",
              padding: "10px 12px",
              color: "#cbd5e1",
              fontSize: 13,
              lineHeight: 1.5
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function toneBorder(tone: "success" | "warning" | "info") {
  if (tone === "success") return "rgba(34,197,94,0.18)";
  if (tone === "warning") return "rgba(245,158,11,0.18)";
  return "rgba(59,130,246,0.18)";
}

function buttonStyle(active = false): React.CSSProperties {
  return {
    borderRadius: 12,
    padding: "10px 14px",
    border: active
      ? "1px solid rgba(34,211,238,0.35)"
      : "1px solid rgba(148,163,184,0.18)",
    background: active ? "rgba(34,211,238,0.12)" : "rgba(15,23,42,0.72)",
    color: active ? "#67e8f9" : "#e2e8f0",
    fontWeight: 700,
    cursor: "pointer"
  };
}

function textareaStyle(): React.CSSProperties {
  return {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    color: "#e2e8f0",
    padding: "10px 12px",
    outline: "none",
    resize: "vertical"
  };
}
