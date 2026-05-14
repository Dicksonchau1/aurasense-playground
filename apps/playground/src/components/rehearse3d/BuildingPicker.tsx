"use client";

export type Building = { id: string; name: string; sub: string; status: "s3"|"mbis"|"ok" };

const BUILDINGS: Building[] = [
  { id: "icc", name: "ICC Tower",    sub: "484m · 108F · Kowloon Station", status: "s3" },
  { id: "k11", name: "K11 Musea",    sub: "38m · 9F · Tsim Sha Tsui",      status: "ok" },
  { id: "tw",  name: "Tower West B", sub: "120m · 29F · West Kowloon",     status: "mbis" },
  { id: "hs",  name: "Harbourside",  sub: "85m · 22F · Hung Hom",          status: "ok" },
];

export default function BuildingPicker({ active, onPick }: { active: string; onPick: (b: Building) => void }) {
  return (
    <div className="space-y-2">
      {BUILDINGS.map(b => (
        <button key={b.id} onClick={() => onPick(b)}
          className="w-full text-left rounded-lg border px-3 py-2 transition"
          style={{
            background: active === b.id ? "var(--aura-sel)" : "rgba(255,255,255,0.5)",
            borderColor: active === b.id ? "rgba(71,105,155,0.4)" : "rgba(255,255,255,0.55)",
          }}>
          <div className="text-sm font-semibold">{b.name}</div>
          <div className="text-[11px] aura-sub">{b.sub}</div>
          <div className="mt-1">
            {b.status === "s3"   && <span className="aura-badge" style={{ background: "rgba(185,28,28,0.15)", color: "#b91c1c", borderColor: "rgba(185,28,28,0.3)" }}>S3 Defect</span>}
            {b.status === "mbis" && <span className="aura-badge aura-badge-warn">MBIS Due</span>}
            {b.status === "ok"   && <span className="aura-badge aura-badge-success">Clear</span>}
          </div>
        </button>
      ))}
    </div>
  );
}
