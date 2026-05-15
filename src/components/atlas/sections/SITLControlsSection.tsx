// ATLAS SITLControlsSection: controls for Software-In-The-Loop simulation
import React from 'react';

export function SITLControlsSection() {
  // TODO: Replace with real SITL control logic
  return (
    <section className="atlas-section sitl-controls-section">
      <h2>SITL Controls</h2>
      <div className="sitl-controls">
        <button>Start SITL</button>
        <button>Pause SITL</button>
        <button>Stop SITL</button>
        <button>Reset Simulation</button>
      </div>
      <div className="sitl-status">Status: <strong>Idle</strong></div>
    </section>
  );
}
