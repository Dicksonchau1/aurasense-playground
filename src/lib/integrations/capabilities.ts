// Canonical capability keys and descriptions

export const CANONICAL_CAPABILITIES = [
  {
    key: 'telemetry',
    displayName: 'Telemetry',
    description: 'Provides real-time telemetry data from units or vehicles.',
  },
  {
    key: 'commandDispatch',
    displayName: 'Command Dispatch',
    description: 'Supports sending commands to units or vehicles.',
  },
  {
    key: 'evidenceAttachment',
    displayName: 'Evidence Attachment',
    description: 'Can attach and retrieve evidence (media, logs, etc).',
  },
  {
    key: 'replayLinkage',
    displayName: 'Replay Linkage',
    description: 'Supports linking to historical data or replays.',
  },
  {
    key: 'missionState',
    displayName: 'Mission State',
    description: 'Exposes mission/task state and progress.',
  },
  {
    key: 'policyReceipts',
    displayName: 'Policy Receipts',
    description: 'Provides policy or governance receipts.',
  },
  {
    key: 'mixedFleetIdentity',
    displayName: 'Mixed-Fleet Identity',
    description: 'Resolves identity across heterogeneous fleets.',
  },
];
