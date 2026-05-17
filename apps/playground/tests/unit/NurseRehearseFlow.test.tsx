import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NurseRehearseFlow from '../../src/app/rehearse-nurse/NurseRehearseFlow';

// Mock fetch for API calls
beforeEach(() => {
  global.fetch = jest.fn((url, opts) => {
    if (url?.toString().includes('/start')) {
      return Promise.resolve({ json: () => Promise.resolve({ sessionId: 'test-session' }) });
    }
    if (url?.toString().includes('/step')) {
      return Promise.resolve({ json: () => Promise.resolve({ feedback: 'Step accepted.' }) });
    }
    if (url?.toString().includes('/complete')) {
      return Promise.resolve({ json: () => Promise.resolve({ verdict: 'pass', summary: 'All steps completed.' }) });
    }
    return Promise.reject('Unknown endpoint');
  }) as any;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('NurseRehearseFlow', () => {
  it('renders and completes all steps', async () => {
    render(<NurseRehearseFlow />);
    expect(screen.getByText(/Starting session/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Nurse Rehearse/)).toBeInTheDocument());
    for (let i = 0; i < 5; i++) {
      const btn = screen.getByRole('button', { name: /Complete Step/ });
      fireEvent.click(btn);
      await waitFor(() => expect(btn).not.toBeDisabled());
    }
    await waitFor(() => expect(screen.getByText(/Session Complete/)).toBeInTheDocument());
    expect(screen.getByText(/Verdict: pass/)).toBeInTheDocument();
    expect(screen.getByText(/All steps completed/)).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    (global.fetch as any).mockImplementationOnce(() => Promise.reject('fail'));
    render(<NurseRehearseFlow />);
    await waitFor(() => expect(screen.getByText(/Failed to start session/)).toBeInTheDocument());
  });
});
