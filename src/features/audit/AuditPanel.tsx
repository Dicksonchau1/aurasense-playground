// Audit Panel with degraded state feedback
import React from 'react';
import { useAudit } from './auditWiring';
import { DegradedStateBanner } from '../../components/status/DegradedStateBanner';
import { DegradedState } from '../../lib/errors/degradedStates';

interface AuditPanelProps {
  sessionId: string;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ sessionId }) => {
  const { auditStatus, error } = useAudit(sessionId);

  let degradedState: DegradedState | null = null;
  if (error) degradedState = DegradedState.PartialApiOutage;
  if (!auditStatus) degradedState = DegradedState.AuditExportFailure;

  return (
    <div>
      {degradedState && (
        <DegradedStateBanner
          state={degradedState}
          onRecover={() => { /* Optionally trigger a refetch or reconnect */ }}
        />
      )}
      {/* ...existing Audit UI, e.g. export status, evidence bundles, compliance, etc... */}
      <div>
        <h3>Audit Export Status</h3>
        {auditStatus ? (
          <pre>{JSON.stringify(auditStatus, null, 2)}</pre>
        ) : (
          <div>No audit export status available.</div>
        )}
      </div>
    </div>
  );
};
