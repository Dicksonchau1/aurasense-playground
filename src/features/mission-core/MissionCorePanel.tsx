// Mission Core Panel with degraded state feedback
import React from 'react';
import { useCommandWithDegradedState } from './useCommandWithDegradedState';
import { DegradedStateBanner } from '../../components/status/DegradedStateBanner';

interface MissionCorePanelProps {
  sessionId: string;
}

export const MissionCorePanel: React.FC<MissionCorePanelProps> = ({ sessionId }) => {
  const {
    state,
    currentCommand,
    error,
    draftCommand,
    submitCommand,
    handleCommandStatus,
    reset,
    degradedState,
  } = useCommandWithDegradedState(sessionId);

  return (
    <div>
      {degradedState && (
        <DegradedStateBanner
          state={degradedState}
          onRecover={reset}
        />
      )}
      {/* ...existing Mission Core UI, e.g. command form, status, etc... */}
      <div>
        <h3>Operator Command Lifecycle</h3>
        <div>Current State: {state}</div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {/* Example: show command form or confirmation modal based on state */}
        {/* ... */}
      </div>
    </div>
  );
};
