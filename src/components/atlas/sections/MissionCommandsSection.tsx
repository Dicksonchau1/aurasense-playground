// ATLAS MissionCommandsSection: renders mission command rail and last command state
import React from 'react';
import { getMissionCommandsPanelVM } from '../../../lib/atlas/view-models-ardupilot';

export function MissionCommandsSection() {
  const { commands, lastAck, lastState } = getMissionCommandsPanelVM();
  return (
    <section className="atlas-section mission-commands-section">
      <h2>Mission Commands</h2>
      <div className="command-rail">
        {commands.map((cmd) => (
          <button key={cmd.label} onClick={cmd.action} disabled={cmd.state !== 'idle'}>
            {cmd.label}
          </button>
        ))}
      </div>
      <div className="command-status">
        <div>Last Acknowledgement: <strong>{lastAck}</strong></div>
        <div>Command State: <strong>{lastState}</strong></div>
      </div>
    </section>
  );
}
