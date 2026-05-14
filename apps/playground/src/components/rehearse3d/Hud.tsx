"use client";

export default function Hud({
  alt, spd, bat, missionTime, coverage, faces,
}: {
  alt: number; spd: number; bat: number; missionTime: string;
  coverage: number; faces: { n: number; e: number; s: number; w: number; r: number };
}) {
  const arc = 175.9;
  const dashOffset = arc - (arc * coverage) / 100;
  return (
    <>
      <div className="absolute top-3 left-3 space-y-1.5 font-mono text-[11px] pointer-events-none">
        <div className="aura-panel" style={{ background: "rgba(5,7,9,0.7)", color: "#e2e8f0", borderColor: "rgba(255,255,255,0.08)" }}>
          DR-A · ALT <span style={{ color: "#00d4c8" }}>{alt.toFixed(1)} m</span> · SPD <span>{spd.toFixed(1)} m/s</span>
        </div>
        <div className="aura-panel" style={{ background: "rgba(5,7,9,0.7)", color: "#e2e8f0", borderColor: "rgba(255,255,255,0.08)" }}>
          BAT <span style={{ color: bat > 50 ? "#22c55e" : bat > 20 ? "#f59e0b" : "#ef4444" }}>{bat}%</span> · GPS <span style={{ color: "#22c55e" }}>LOCK</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 space-y-1.5 font-mono text-[11px] pointer-events-none">
        <div className="aura-panel" style={{ background: "rgba(5,7,9,0.7)", color: "#e2e8f0", borderColor: "rgba(255,255,255,0.08)" }}>{missionTime}</div>
      </div>
      <div className="absolute bottom-16 left-3 pointer-events-none">
        <div className="aura-panel font-mono text-[10px]" style={{ background: "rgba(5,7,9,0.78)", color: "#e2e8f0", borderColor: "rgba(255,255,255,0.08)", minWidth: 160 }}>
          <div className="uppercase tracking-wider opacity-60 mb-2">Face Coverage</div>
          {(["n","e","s","w","r"] as const).map((k, i) => (
            <div key={k} className="flex items-center gap-2 mb-1">
              <span style={{ width: 30 }}>{["NORTH","EAST","SOUTH","WEST","ROOF"][i]}</span>
              <div className="flex-1 h-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded" style={{ width: `${faces[k]}%`, background: "#00d4c8", transition: "width .4s ease" }} />
              </div>
              <span style={{ width: 28, textAlign: "right" }}>{faces[k]}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-16 right-3 pointer-events-none">
        <div className="aura-panel flex flex-col items-center" style={{ background: "rgba(5,7,9,0.78)", color: "#e2e8f0", borderColor: "rgba(255,255,255,0.08)", padding: 10 }}>
          <svg width="80" height="80" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
            ircle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            ircle cx="36" cy="36" r="28" fill="none" stroke="#00d4c8" strokeWidth="5"
              strokeDasharray={arc} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset .5s ease" }} />
          </svg>
          <div className="text-base font-bold mt-1" style={{ color: "#00d4c8" }}>{coverage}%</div>
          <div className="text-[9px] opacity-60 font-mono uppercase">cov</div>
        </div>
      </div>
    </>
  );
}
