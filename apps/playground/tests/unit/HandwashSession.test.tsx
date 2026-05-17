import { renderHook, act } from '@testing-library/react-hooks';
import { useHandwashSession } from '../../../src/app/rehearse-nurse/handwash/components/useHandwashSession';
import { HANDWASH_STEPS } from '../../../src/app/rehearse-nurse/handwash/components/mockData';

describe('useHandwashSession', () => {
  it('starts, advances, completes, and resets session', () => {
    const { result } = renderHook(() => useHandwashSession({ steps: HANDWASH_STEPS }));
    // Initial state
    expect(result.current.sessionState).toBe('ready');
    // Start
    act(() => result.current.startSession());
    expect(result.current.sessionState).toBe('active');
    // Advance through all steps
    for (let i = 0; i < HANDWASH_STEPS.length; i++) {
      act(() => result.current.advanceStep());
    }
    expect(result.current.sessionState).toBe('completed');
    expect(result.current.summary?.completedSteps).toBe(HANDWASH_STEPS.length);
    // Reset
    act(() => result.current.resetSession());
    expect(result.current.sessionState).toBe('ready');
  });

  it('completes too quickly if elapsedSeconds < 20', () => {
    const { result } = renderHook(() => useHandwashSession({ steps: HANDWASH_STEPS }));
    act(() => result.current.startSession());
    // Simulate quick completion
    for (let i = 0; i < HANDWASH_STEPS.length; i++) {
      act(() => result.current.advanceStep());
    }
    act(() => result.current.completeSession());
    expect(result.current.summary?.completionLabel).toBe('Completed too quickly');
  });
});
