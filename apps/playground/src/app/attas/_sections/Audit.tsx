"use client";

import Card from "../../../components/shell/Card";

const HISTORY = [
  { ts: "2026-05-14 09:42", user: "Dickson", action: "Sim run — Tower A, Matrice 30T, crack survey",   result: "Pass" },
  { ts: "2026-05-14 10:15", user: "Dickson", action: "Param change — wind 3.1 → 5.2 m/s",               result: "Saved" },
  { ts: "2026-05-14 11:03", user: "System",  action: "NOTAM check auto-refresh",                        result: "Clear" },
  { ts: "2026-05-15 08:30", user: "Dickson", action: "Sim run — Tower B, Matrice 350 RTK, thermal scan", result: "Pass" },
  { ts: "2026-05-15 09:12", user: "Dickson", action: "Thermal overlay toggled ON",                       result: "Saved" },
  { ts: "2026-05-15 11:55", user: "Dickson", action: "Sandbox opened — ATTAS",                           result: "Active" },
];

const STATUS_COLOR: Record<string, string> = {
  Pass:   "var(--aura-ok)",
  Saved:  "var(--aura-accent2)",
  Clear:  "var(--aura-ok)",
  Active: "var(--aura-accent)",
  Fail:   "var(--aura-err)",
};

export default function Audit() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card title="Session audit log">
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-[130px_60px_1fr_60px] gap-2 font-semibold aura-sub pb-1"
              style={{ borderBottom: "1px solid var(--aura-line)" }}>
              <span>Timestamp</span><span>User</span><span>Action</span><span>Result</span>
            </div>
            {HISTORY.map((h, i) => (
              <div key={i} className="grid grid-cols-[130px_60px_1fr_60px] gap-2 py-1 rounded px-1"
                style={{ background: i % 2 === 0 ? "var(--aura-sel)" : "transparent", color: "var(--aura-text)" }}>
                <span className="aura-sub">{h.ts}</span>
                <span>{h.user}</span>
                <span>{h.action}</span>
                <span className="font-semibold" style={{ color: STATUS_COLOR[h.result] ?? "var(--aura-text)" }}>
                  {h.result}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card title="Compliance">
        <div className="space-y-2 text-sm" style={{ color: "var(--aura-text)" }}>
          <div className="flex justify-between"><span className="aura-sub">Regulation</span><span>CAD HK RPAS Ord.</span></div>
          <div className="flex justify-between"><span className="aura-sub">MBIS ref.</span><span>Code of Practice 2022</span></div>
          <div className="flex justify-between"><span className="aura-sub">Data retention</span><span>90 days</span></div>
          <div className="flex justify-between"><span className="aura-sub">Report format</span><span>PDF / JSON</span></div>
          <div className="flex justify-between"><span className="aura-sub">Sessions today</span><span>3</span></div>
          <hr style={{ borderColor: "var(--aura-line)" }} />
          <p className="aura-sub text-xs">All simulation runs are logged immutably. Export available after each session.</p>
        </div>
      </Card>
    </div>
  );
}
