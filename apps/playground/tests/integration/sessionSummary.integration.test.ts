import { generateSessionSummary } from '../../src/utils/generateSessionSummary';
import { render } from '@testing-library/react';
import SessionSummary from '../../src/components/SessionSummary';

describe('SessionSummary integration', () => {
  it('renders summary from generated blob', () => {
    const summary = generateSessionSummary({
      session_id: 's2',
      user_id: 'u2',
      scenario: 'iv_insertion',
      started_at: '2026-05-14T10:00:00Z',
      closed_at: '2026-05-14T10:05:00Z',
      aborted: false,
      session_events: [
        { type: 'needle_inserted', timestamp: '2026-05-14T10:01:00Z' },
        { type: 'flashback_observed', timestamp: '2026-05-14T10:02:00Z' },
      ],
    });
    const { getByTestId, getByText } = render(<SessionSummary summary={summary} />);
    expect(getByTestId('session-summary')).toBeInTheDocument();
    expect(getByText(/Duration:/)).toBeTruthy();
    expect(getByText(/We observed:/)).toBeTruthy();
  });

  it('renders fallback for empty events', () => {
    const summary = generateSessionSummary({
      session_id: 's3',
      user_id: 'u3',
      scenario: 'cpr',
      started_at: '2026-05-14T10:00:00Z',
      closed_at: '2026-05-14T10:01:00Z',
      aborted: false,
      session_events: [],
    });
    const { getByText } = render(<SessionSummary summary={summary} />);
    expect(getByText(/No events were recorded/)).toBeTruthy();
  });
});
