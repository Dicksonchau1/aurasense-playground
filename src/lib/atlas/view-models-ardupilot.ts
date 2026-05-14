// ...entire new file content as provided in the user request...// ATLAS ArduPilot view-models for Failsafe and Mission Commands panels
import { useArduPilotFailsafes, useArduPilotMissionCommands, FailsafePolicy, MissionCommand } from './hooks-ardupilot';

export function getFailsafePanelVM() {
  const failsafes: FailsafePolicy = useArduPilotFailsafes();
  return {
    rows: [
      { label: 'Battery Failsafe', value: failsafes.battery },
      { label: 'Link-Loss Failsafe', value: failsafes.linkLoss },
      { label: 'Geofence Breach', value: failsafes.geofence },
      { label: 'Nav Degradation', value: failsafes.navDegradation },
    ],
    readiness: failsafes.readiness,
  };
}

export function getMissionCommandsPanelVM() {
  const { commands, lastAck, lastState } = useArduPilotMissionCommands();
  return {
    commands,
    lastAck,
    lastState,
  };
}
