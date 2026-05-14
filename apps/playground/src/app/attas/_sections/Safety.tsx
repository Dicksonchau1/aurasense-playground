"use client";
import Card from "../../../components/shell/Card";

export default function Safety() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title="Pre-flight checks">
        <ul className="text-sm space-y-2">
          ><span className="aura-sub">RTK lock</span><span className="aura-badge aura-badge-success">OK</span></li>
          ><span className="aura-sub">Battery</span><span className="aura-badge aura-badge-success">95%</span></li>
          ><span className="aura-sub">Rotor balance</span><span className="aura-badge aura-badge-success">OK</span></li>
          ><span className="aura-sub">Geofence</span><span className="aura-badge aura-badge-success">Clear</span></li>
          ><span className="aura-sub">NOTAM</span><span className="aura-badge aura-badge-success">Clear</span></li>
          ><span className="aura-sub">Crosswind</span><span className="aura-badge aura-badge-warn">Moderate</span></li>
        </ul>
      </Card>
      <Card title="Go / No-Go">
        <div className="text-3xl font-bold" style={{ color: "#2e7d52" }}>45 / 46 pass</div>
        <div className="aura-sub mt-1">1 advisory · crosswind moderate</div>
        <div className="flex gap-3 mt-4">
          <button className="aura-btn aura-btn-primary flex-1">GO</button>
          <button className="aura-btn aura-btn-danger flex-1">NO-GO</button>
        </div>
      </Card>
    </div>
  );
}
