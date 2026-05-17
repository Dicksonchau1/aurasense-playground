import { render } from '@testing-library/react';
import HandwashAnalyticsPanel, { saveAnalytics } from '../../../src/app/rehearse-nurse/handwash/components/HandwashAnalyticsPanel';

describe('HandwashAnalyticsPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders no sessions if none exist', () => {
    const { queryByText } = render(<HandwashAnalyticsPanel />);
    expect(queryByText(/Past Handwash Sessions/)).not.toBeInTheDocument();
  });

  it('renders recent sessions', () => {
    saveAnalytics({
      timestamp: Date.now(),
      summary: {
        completedSteps: 7,
        totalSteps: 7,
        elapsedSeconds: 22,
        completionLabel: 'Complete',
        note: 'All steps completed.'
      }
    });
    const { getByText } = render(<HandwashAnalyticsPanel />);
    expect(getByText(/Past Handwash Sessions/)).toBeInTheDocument();
    expect(getByText(/Complete/)).toBeInTheDocument();
  });
});
