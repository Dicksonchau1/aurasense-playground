"use client";

import Card from "../../../components/shell/Card";

const CHECKS = [
  { label: "NOTAM clearance",     status: "pass",  note: "No active NOTAMs within 2 km" },
  { label: "KAF/CADS registration", status: "pass",  note: "UAS-ID broadcast active" },
  { label: "Battery pre-flight",   status: "pass",  note: "96% SoC, cell delta 12 mV" },
  { label: "Wind envelope",        status: "warn",  note: "5.2 m/s — within limits, monitor gusts" },
  { label: "Crowd buffer",         status: "pass",  note: "30 m lateral clearance confirmed" },
  { label: "Emergency RTH zone",   status: "pass",  note: "LZ at podium rooftop designated" },
  { label: "Thermal calibration",  status: "pass",  note: "NUC completed, drift < 0.3°C" },
  { label: "Comms link",           status: "pass",  note: "RC + 4G fallback active" },
];

const COLORS: Record<string, string> = {
  pass: "var(--aura-ok)",
  warn: "var(--aura-warn)",
  fail: "var(--aura-err)",
};

export default function Safety() {
  const passCount = CHECKS.filter(c => c.status === "pass").length;
  const warnCount = CHECKS.filter(c => c.status === "warn").length;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Pre-flight checklist">
        <div className="space-y-2">
          {CHECKS.map(c => (
            <div key={c.label} className="flex items-start gap-2 rounded-lg px-3 py-2"
              style={{ background: "var(--aura-sel)", border: "1px solid var(--aura-line)" }}>
              <span className="mt-0.5 text-base leading-none" style={{ color: COLORS[c.status] }}>
                {c.status === "pass" ? "✓" : c.status === "warn" ? "⚠" : "✗"}
              </span>
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--aura-text)" }}>{c.label}</div>
                <div className="text-xs aura-sub">{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Safety summary">
        <div className="space-y-3 text-sm" style={{ color: "var(--aura-text)" }}>
          <div className="flex justify-between">
            <span>Checks passed</span>
            <span className="font-bold" style={{ color: "var(--aura-ok)" }}>{passCount} / {CHECKS.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Warnings</span>
            <span className="font-bold" style={{ color: "var(--aura-warn)" }}>{warnCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Flight status</span>
            <span className="font-bold" style={{ color: warnCount > 0 ? "var(--aura-warn)" : "var(--aura-ok)" }}>
              {warnCount > 0 ? "Conditional GO" : "GO"}
            </span>
          </div>
          <hr style={{ borderColor: "var(--aura-line)" }} />
          <p className="aura-sub text-xs">
            All safety checks comply with CAD Hong Kong RPAS Operations Order. Pilot must
            maintain VLOS throughout mission. Wind gusts above 8 m/s trigger auto-RTH.
          </p>
        </div>
      </Card>
    </div>
  );
}
