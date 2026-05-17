// OverlayLayers.tsx: ATLAS Rehearse 3D overlay/HUD scaffolding
import React, { useState, useCallback } from "react";

// Layer keys and labels
const LAYERS = [
  { key: "L1", label: "Scene grid + axis gizmo", toggle: "G" },
  { key: "L2", label: "Predicted obstacle/collision boxes", toggle: "D" },
  { key: "L3", label: "4 corner HUD blocks", toggle: "H" },
  { key: "L4", label: "Attitude indicator (PFD)", toggle: "A" },
  { key: "L5", label: "Compass ribbon", toggle: "A" },
  { key: "L6", label: "Reticle + waypoint pick", toggle: "R" },
  { key: "L7", label: "Annotation pins in 3D space", toggle: "N" },
  { key: "L8", label: "PiP 2D map", toggle: "M" },
  { key: "L9", label: "Status strip", toggle: null },
];

export default function OverlayLayers() {
  // Track which overlays are visible
  const [visible, setVisible] = useState(() => {
    // L0 (canvas) and L9 (status) always on, others default on
    const v = {};
    LAYERS.forEach(l => { v[l.key] = true; });
    return v;
  });

  // Keyboard toggle handler
  const onKeyDown = useCallback((e) => {
    if (e.repeat) return;
    LAYERS.forEach(l => {
      if (l.toggle && e.key.toUpperCase() === l.toggle) {
        setVisible(v => ({ ...v, [l.key]: !v[l.key] }));
      }
    });
    // Cinematic mode: C hides L1–L8
    if (e.key.toUpperCase() === "C") {
      setVisible(v => {
        const nv = { ...v };
        LAYERS.forEach(l => { if (l.key !== "L9") nv[l.key] = false; });
        return nv;
      });
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div className="overlay-root pointer-events-none absolute inset-0 z-20">
      {/* L1–L9 overlays, conditionally rendered */}
      {LAYERS.map(l => visible[l.key] && (
        <div key={l.key} className={`overlay-layer overlay-${l.key} absolute inset-0`}>
          <div className="overlay-label bg-black/40 text-cyan-300 text-xs px-2 py-1 rounded absolute top-2 right-2">
            {l.label} {l.toggle && <span className="ml-2 text-amber-300">[{l.toggle}]</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
