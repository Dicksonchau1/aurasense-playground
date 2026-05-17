// Flight Stack Panel with degraded state feedback
import React from 'react';
import { useFlightStack } from './flightStackWiring';
import { DegradedStateBanner } from '../../components/status/DegradedStateBanner';
import { DegradedState } from '../../lib/errors/degradedStates';

interface FlightStackPanelProps {
  sessionId: string;
}

export const FlightStackPanel: React.FC<FlightStackPanelProps> = ({ sessionId }) => {
  const { flightSession, error } = useFlightStack(sessionId);

  let degradedState: DegradedState | null = null;
  if (error) degradedState = DegradedState.PartialApiOutage;
  if (!flightSession) degradedState = DegradedState.NoSessionSelected;

  return (
    <div>
      {degradedState && (
        <DegradedStateBanner
          state={degradedState}
          onRecover={() => { /* Optionally trigger a refetch or reconnect */ }}
        />
      )}
      {/* ...existing Flight Stack UI, e.g. session status, vehicle link, controls, etc... */}
      <div>
        <h3>Flight Session</h3>
        {flightSession ? (
          <pre>{JSON.stringify(flightSession, null, 2)}</pre>
        ) : (
          <div>No flight session data available.</div>
        )}
      </div>
    </div>
  );
};
