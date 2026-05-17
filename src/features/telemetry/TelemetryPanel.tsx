// Telemetry Panel with degraded state feedback
import React from 'react';
import { useTelemetryWithDegradedState } from './useTelemetryWithDegradedState';
import { DegradedStateBanner } from '../../components/status/DegradedStateBanner';

interface TelemetryPanelProps {
  sessionId: string;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ sessionId }) => {
  const { telemetry, degradedState } = useTelemetryWithDegradedState(sessionId);

  return (
    <div>
      {degradedState && (
        <DegradedStateBanner
          state={degradedState}
          onRecover={() => { /* Optionally trigger a refetch or reconnect */ }}
        />
      )}
      {/* ...existing Telemetry UI, e.g. live metrics, charts, etc... */}
      <div>
        <h3>Live Telemetry</h3>
        {telemetry ? (
          <pre>{JSON.stringify(telemetry, null, 2)}</pre>
        ) : (
          <div>No telemetry data available.</div>
        )}
      </div>
    </div>
  );
};
