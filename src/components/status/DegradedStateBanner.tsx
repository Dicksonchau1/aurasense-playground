// Banner component for displaying degraded state messages and recovery actions
import React from 'react';
import { DegradedState, getDegradedStateMessage } from '../../lib/errors/degradedStates';

interface DegradedStateBannerProps {
  state: DegradedState;
  onRecover?: () => void;
}

export const DegradedStateBanner: React.FC<DegradedStateBannerProps> = ({ state, onRecover }) => {
  return (
    <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '4px', margin: '8px 0', border: '1px solid #ffeeba' }}>
      <strong>Notice:</strong> {getDegradedStateMessage(state)}
      {onRecover && (
        <button style={{ marginLeft: 16, padding: '4px 12px', background: '#ffeeba', border: 'none', borderRadius: '3px', cursor: 'pointer' }} onClick={onRecover}>
          Retry
        </button>
      )}
    </div>
  );
};
