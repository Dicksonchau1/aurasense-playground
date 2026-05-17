// Telemetry feature wiring with degraded state integration
import { useTelemetry } from './telemetryWiring';
import { DegradedState } from '../../lib/errors/degradedStates';
import { useMemo } from 'react';

export function useTelemetryWithDegradedState(sessionId: string) {
  const { telemetry, error, isStale } = useTelemetry(sessionId);

  const degradedState = useMemo(() => {
    if (error) return DegradedState.PartialApiOutage;
    if (isStale) return DegradedState.StaleTelemetry;
    if (!telemetry) return DegradedState.NoActiveVehicle;
    return null;
  }, [telemetry, error, isStale]);

  return { telemetry, degradedState };
}
