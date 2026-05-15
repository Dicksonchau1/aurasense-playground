"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Card from "@/components/shell/Card";
import Button from "@/components/shell/Button";
import DroneForm from "@/components/drones/DroneForm";
import { DRONE_STATUS_LABEL, type Drone } from "@/lib/drones/types";

export default function DronesPage() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Drone | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/drones", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Failed to load");
      setDrones(j.drones);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Retire this drone permanently? This cannot be undone.")) return;
    const r = await fetch(`/api/drones/${id}`, { method: "DELETE" });
    if (r.ok) load();
    else { const j = await r.json(); alert(j.error ?? "Delete failed"); }
  }

  function onSaved() {
    setShowForm(false);
    setEditing(null);
    load();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="aura-h1">Drone Registry</h1>
          <p className="aura-sub mt-1">
            Owned airframes. RLS-isolated per account. Required before mission planning.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          Register drone
        </Button>
      </header>

      {err && (
        <div className="aura-panel" style={{ background: "rgba(185,28,28,0.08)", borderColor: "rgba(185,28,28,0.2)", color: "#7f1d1d" }}>
          {err}
        </div>
      )}

      {showForm && (
        <DroneForm
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSaved={onSaved}
        />
      )}

      {loading ? (
        <Card><p className="aura-sub">Loading drones…</p></Card>
      ) : drones.length === 0 ? (
        <Card>
          <p className="aura-sub">
            No drones registered yet. Click <span className="font-semibold">Register drone</span> to add your first airframe.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drones.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">{d.name}</div>
                  <div className="aura-sub">{d.model} · SN {d.serial}</div>
                </div>
                <span className={`aura-badge ${
                  d.status === "active" ? "aura-badge-success" :
                  d.status === "maintenance" ? "aura-badge-warn" :
                  d.status === "retired" ? "aura-badge-danger" : ""
                }`}>
                  {DRONE_STATUS_LABEL[d.status]}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="aura-sub">Max alt</div>
                  <div className="font-mono">{d.max_alt_m}m</div>
                </div>
                <div>
                  <div className="aura-sub">Max speed</div>
                  <div className="font-mono">{d.max_speed_ms}m/s</div>
                </div>
                <div>
                  <div className="aura-sub">Battery</div>
                  <div className="font-mono">{d.battery_wh}Wh</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => { setEditing(d); setShowForm(true); }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => remove(d.id)}
                >
                  Retire
                </Button>
              </div>

              <div className="mt-3 aura-sub text-xs">
                Last seen: {d.last_seen_at ? new Date(d.last_seen_at).toLocaleString() : "—"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
