import React from 'react';
import type { SessionSummaryBlob } from '../utils/generateSessionSummary';

interface SessionSummaryProps {
  summary: SessionSummaryBlob | null;
  loading?: boolean;
  error?: boolean;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ summary, loading, error }) => {
  if (loading) return <div>Loading summary…</div>;
  if (error) return <div>Could not load session summary.</div>;
  if (!summary) return <div>Session closed. No events were recorded.</div>;

  return (
    <div data-testid="session-summary">
      <div><strong>Duration:</strong> {summary.duration_human}</div>
      <div>{summary.what_we_saw}</div>
    </div>
  );
};

export default SessionSummary;
