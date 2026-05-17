import { render } from '@testing-library/react';
import HandwashAnalyticsChart from '../../../src/app/rehearse-nurse/handwash/components/HandwashAnalyticsChart';

describe('HandwashAnalyticsChart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders no chart if no data', () => {
    const { getByText } = render(<HandwashAnalyticsChart />);
    expect(getByText(/No sessions to display/)).toBeInTheDocument();
  });

  it('renders chart with data', () => {
    localStorage.setItem('handwash_analytics', JSON.stringify([
      {
        timestamp: Date.now(),
        summary: {
          completedSteps: 7,
          totalSteps: 7,
          elapsedSeconds: 25,
          completionLabel: 'Complete',
          note: 'All steps completed.'
        }
      }
    ]));
    const { container } = render(<HandwashAnalyticsChart />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
