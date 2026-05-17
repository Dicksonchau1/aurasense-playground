// Command lifecycle with degraded state integration
import { useCommandLifecycle } from './commandLifecycle';
import { DegradedState } from '../../lib/errors/degradedStates';
import { useMemo } from 'react';

export function useCommandWithDegradedState(sessionId: string) {
  const lifecycle = useCommandLifecycle(sessionId);

  const degradedState = useMemo(() => {
    if (lifecycle.state === 'rejected') return DegradedState.RejectedCommand;
    if (lifecycle.error) return DegradedState.PartialApiOutage;
    return null;
  }, [lifecycle.state, lifecycle.error]);

  return { ...lifecycle, degradedState };
}
