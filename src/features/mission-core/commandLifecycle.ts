// Operator Command Lifecycle Logic for Mission Core
import { useState, useCallback } from 'react';
import api from '../../services/api-client';
import { OperatorCommand, OperatorCommandSchema } from '../../contracts/operator-command';
import { useDispatch } from 'react-redux';
import { addCommand, updateCommandStatus, setCommandError } from '../../domain/mission/missionSlice';

export type CommandLifecycleState =
  | 'draft'
  | 'confirm'
  | 'submitting'
  | 'pending'
  | 'acknowledged'
  | 'rejected'
  | 'timeout';

export function useCommandLifecycle(sessionId: string) {
  const [state, setState] = useState<CommandLifecycleState>('draft');
  const [currentCommand, setCurrentCommand] = useState<OperatorCommand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Draft a command
  const draftCommand = useCallback((command: Omit<OperatorCommand, 'id' | 'issuedAt' | 'ackTime' | 'result'>) => {
    setCurrentCommand({
      ...command,
      id: '',
      issuedAt: new Date().toISOString(),
      ackTime: null,
      result: 'PENDING',
    } as OperatorCommand);
    setState('confirm');
  }, []);

  // Confirm and submit command
  const submitCommand = useCallback(async () => {
    if (!currentCommand) return;
    setState('submitting');
    try {
      const res = await api.post(`/flight-sessions/${sessionId}/commands`, currentCommand);
      const cmd: OperatorCommand = OperatorCommandSchema.parse(res.data);
      dispatch(addCommand(cmd));
      setCurrentCommand(cmd);
      setState('pending');
      // Wait for ack/reject/timeout via WebSocket event (handled in reducer)
    } catch (e) {
      setError('Failed to submit command');
      dispatch(setCommandError('Failed to submit command'));
      setState('draft');
    }
  }, [currentCommand, sessionId, dispatch]);

  // Update command status (to be called from WebSocket event handler)
  const handleCommandStatus = useCallback((cmd: OperatorCommand) => {
    if (!currentCommand || cmd.id !== currentCommand.id) return;
    setCurrentCommand(cmd);
    dispatch(updateCommandStatus(cmd));
    if (cmd.result === 'ACKNOWLEDGED') setState('acknowledged');
    else if (cmd.result === 'REJECTED') setState('rejected');
    else if (cmd.result === 'TIMEOUT') setState('timeout');
  }, [currentCommand, dispatch]);

  // Reset to draft
  const reset = useCallback(() => {
    setCurrentCommand(null);
    setState('draft');
    setError(null);
  }, []);

  return {
    state,
    currentCommand,
    error,
    draftCommand,
    submitCommand,
    handleCommandStatus,
    reset,
  };
}

// UI components should use this hook to manage the full operator command lifecycle, including confirmation modals and result banners.
