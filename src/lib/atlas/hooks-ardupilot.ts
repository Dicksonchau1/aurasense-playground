// ...entire new file content as provided in the user request...// ATLAS ArduPilot hooks expansion for Failsafe and Mission Commands
import { useMemo } from 'react';

// Failsafe policy types
export type FailsafePolicy = {
  battery: string;
  linkLoss: string;
  geofence: string;
  navDegradation: string;
  readiness: 'conservative' | 'permissive' | 'unsafe';
};

export function useArduPilotFailsafes(): FailsafePolicy {
  // TODO: Replace with real data source
  return useMemo(() => ({
    battery: 'RTL',
    linkLoss: 'Land',
    geofence: 'RTL',
    navDegradation: 'Hold',
    readiness: 'conservative',
  }), []);
}

// Mission command types
export type MissionCommand = {
  label: string;
  action: () => void;
  state: 'idle' | 'pending' | 'acknowledged';
};

export function useArduPilotMissionCommands(): {
  commands: MissionCommand[];
  lastAck: string;
  lastState: string;
} {
  // TODO: Replace with real command logic
  return useMemo(() => ({
    commands: [
      { label: 'Hold', action: () => {}, state: 'idle' },
      { label: 'Resume', action: () => {}, state: 'idle' },
      { label: 'RTL', action: () => {}, state: 'idle' },
      { label: 'Land', action: () => {}, state: 'idle' },
      { label: 'Pause Mission', action: () => {}, state: 'idle' },
      { label: 'Skip WP', action: () => {}, state: 'idle' },
    ],
    lastAck: 'None',
    lastState: 'Idle',
  }), []);
}
