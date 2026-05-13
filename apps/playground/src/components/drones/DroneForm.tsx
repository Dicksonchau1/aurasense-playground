"use client";

import { useState, FormEvent } from "react";
import Card from "@/components/shell/Card";
import Button from "@/components/shell/Button";
import {
  Drone,
  DroneInput,
  DroneCapabilities,
  DEFAULT_DRONE_INPUT,
  DRONE_STATUS_LABEL,
  DroneStatus,
  validateDroneInput,
} from "@/lib/drones/types";

interface Props {
  initial: Drone | null;
  onCancel: () => void;
  onSaved: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  marginTop: 4,
  background: "#1c2530",
  border: "1px solid #2d3d4f",
  borderRadius: 6,
  color: "#c8d8e8",
  fontSize: 13,
};

const monoInputStyle: React.CSSProperties = {
  ...inputStyle,
  fontFamily: "JetBrains Mono, ui-monospace, monospace",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#7090a8",
  display: "block",
};

export default function DroneForm({ initial, onCancel, onSaved }: Props) {
  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        name: initial.name,
        model: initial.model,
        serial: initial.serial,
        status: initial.status,
        max_alt_m: initial.max_alt_m,
        max_speed_ms: initial.max_speed_ms,
        battery_wh: initial.battery_wh,
        capabilities: { ...DEFAULT_DRONE_INPUT.capabilities, ...(initial.capabilities ?? {}) },
      };
    }
    return { ...DEFAULT_DRONE_INPUT };
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null as string | null);

  function update(key: keyof DroneInput, value: any): void {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateCap(key: keyof DroneCapabilities, value: any): void {
    setForm((f) => ({ ...f, capabilities: { ...f.capabilities, [key]: value } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validateDroneInput(form);
    if (v) { setError(v); return; }

    setSubmitting(true);
    try {
      const url = initial ? `/api/drones/${initial.id}` : "/api/drones";
      const method = initial ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? `${method} failed`);
      onSaved();
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  const statuses = ["registered", "active", "maintenance", "retired"] as const;
  const caps = form.capabilities ?? {};

  return (
    <div style={{ background: "#161d25", border: "1px solid #2d3d4f", borderRadius: 12, padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#c8d8e8" }}>
            {initial ? `Edit ${initial.name}` : "Register New Drone"}
          </h2>
          <p style={{ fontSize: 12, color: "#7090a8" }}>
            Airframe details for mission planning and audit chain. RLS-isolated per owner.
          </p>
        </div>

        {error && (
          <div style={{ padding: "10px 14px", background: "rgba(224,85,69,0.12)", border: "1px solid rgba(224,85,69,0.35)", borderRadius: 8, color: "#fca5a5", fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <span style={labelStyle}>Name *</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              minLength={2}
              maxLength={64}
              placeholder="Inspector-01"
              style={inputStyle}
            />
          </label>
          <label>
            <span style={labelStyle}>Model *</span>
            <input
              type="text"
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              required
              placeholder="DJI Mavic 3 Enterprise"
              style={inputStyle}
            />
          </label>
          <label>
            <span style={labelStyle}>Serial number *</span>
            <input
              type="text"
              value={form.serial}
              onChange={(e) => update("serial", e.target.value)}
              required
              minLength={3}
              placeholder="SN-XXXX-XXXX"
              style={monoInputStyle}
            />
          </label>
          <label>
            <span style={labelStyle}>Status</span>
            <select
              value={form.status ?? "registered"}
              onChange={(e) => update("status", e.target.value as DroneStatus)}
              style={inputStyle}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{DRONE_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </label>
        </div>

        <fieldset style={{ border: "1px solid #2d3d4f", borderRadius: 8, padding: 14 }}>
          <legend style={{ fontSize: 11, color: "#7090a8", textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 6px" }}>Flight envelope</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <label>
              <span style={labelStyle}>Max altitude (m)</span>
              <input type="number" value={form.max_alt_m ?? 120} onChange={(e) => update("max_alt_m", parseFloat(e.target.value) || 0)} min={1} max={500} style={monoInputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Max speed (m/s)</span>
              <input type="number" value={form.max_speed_ms ?? 15} onChange={(e) => update("max_speed_ms", parseFloat(e.target.value) || 0)} min={1} max={50} step={0.1} style={monoInputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Battery (Wh)</span>
              <input type="number" value={form.battery_wh ?? 100} onChange={(e) => update("battery_wh", parseFloat(e.target.value) || 0)} min={1} style={monoInputStyle} />
            </label>
          </div>
        </fieldset>

        <fieldset style={{ border: "1px solid #2d3d4f", borderRadius: 8, padding: 14 }}>
          <legend style={{ fontSize: 11, color: "#7090a8", textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 6px" }}>Capabilities</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <span style={labelStyle}>RTSP / SRT stream URL</span>
              <input type="text" value={caps.rtsp_url ?? ""} onChange={(e) => updateCap("rtsp_url", e.target.value)} placeholder="rtsp://camera.local:554/stream" style={monoInputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Firmware</span>
              <input type="text" value={caps.firmware ?? ""} onChange={(e) => updateCap("firmware", e.target.value)} placeholder="v01.00.0500" style={monoInputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Max optical zoom</span>
              <input type="number" value={caps.zoom_max ?? 1} onChange={(e) => updateCap("zoom_max", parseFloat(e.target.value) || 1)} min={1} max={56} step={0.5} style={monoInputStyle} />
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 18 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c8d8e8", cursor: "pointer" }}>
                <input type="checkbox" checked={!!caps.geofence_enabled} onChange={(e) => updateCap("geofence_enabled", e.target.checked)} style={{ accentColor: "#3d9ea8" }} />
                Geofence enforcement
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#c8d8e8", cursor: "pointer" }}>
                <input type="checkbox" checked={!!caps.thermal} onChange={(e) => updateCap("thermal", e.target.checked)} style={{ accentColor: "#3d9ea8" }} />
                Thermal imaging
              </label>
            </div>
          </div>
          <label style={{ display: "block", marginTop: 12 }}>
            <span style={labelStyle}>Notes (optional)</span>
            <textarea value={caps.notes ?? ""} onChange={(e) => updateCap("notes", e.target.value)} rows={2} placeholder="Maintenance schedule, payload notes, etc." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </label>
        </fieldset>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: "1px solid #243040" }}>
          <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save changes" : "Register drone"}
          </Button>
        </div>
      </form>
    </div>
  );
}
