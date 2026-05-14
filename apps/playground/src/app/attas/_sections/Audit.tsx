"use client";
import Card from "../../../components/shell/Card";

const AUDIT = [
  { ts: "09:14:22", action: "Brand selected DJI Enterprise", hash: "3a8f2cd91e" },
  { ts: "09:14:35", action: "Drone selected Matrice 30T",    hash: "7b1d4af23c" },
  { ts: "09:14:48", action: "Task selected Facade Crack",    hash: "9c5e1ba77f" },
  { ts: "09:15:01", action: "Building selected Tower A",     hash: "2f4d8bc33a" },
];

export default function Audit() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Audit trail">
        <div className="space-y-2">
          {AUDIT.map((a) => (
            <div key={a.hash} className="aura-panel flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: "#2e7d52" }} />
              <div className="flex-1">
                <div className="text-sm font-semibold">{a.action}</div>
                <div className="text-xs aura-sub">{a.ts}</div>
                <div className="text-[10px] font-mono mt-1 inline-block px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.06)" }}>hash {a.hash}</div>
              </div>
              <span className="aura-badge aura-badge-success">OK</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Merkle chain">
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="aura-panel">Root a1b2c3d4e5f6</div>
          <div className="aura-panel ml-4">Session 3a8f2cd91e</div>
          <div className="aura-panel ml-8">Event 7b1d4af23c</div>
          <div className="aura-panel ml-12">Event 9c5e1ba77f</div>
          <div className="aura-panel ml-12">Event 2f4d8bc33a</div>
        </div>
      </Card>
    </div>
  );
}
