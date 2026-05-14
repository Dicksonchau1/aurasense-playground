import { generateSessionSummary, GenerateSessionSummaryInput } from '../../src/utils/generateSessionSummary';

describe('generateSessionSummary', () => {
  const base: GenerateSessionSummaryInput = {
    session_id: 's1',
    user_id: 'u1',
    scenario: 'wound_care',
    started_at: '2026-05-14T10:00:00Z',
    closed_at: '2026-05-14T10:04:12Z',
    aborted: false,
    session_events: [
      { type: 'wound_cleaned', timestamp: '2026-05-14T10:01:00Z' },
      { type: 'dressing_applied', timestamp: '2026-05-14T10:02:00Z' },
      { type: 'gloves_on', timestamp: '2026-05-14T10:03:00Z' },
    ],
  };

  it('formats duration correctly', () => {
    const summary = generateSessionSummary(base);
    expect(summary.duration_human).toBe('4 min 12 sec');
  });

  it('handles under 1 sec', () => {
    const input = { ...base, started_at: '2026-05-14T10:00:00Z', closed_at: '2026-05-14T10:00:00Z' };
    const summary = generateSessionSummary(input);
    expect(summary.duration_human).toBe('under 1 sec');
  });

  it('handles >1 hour', () => {
    const input = { ...base, started_at: '2026-05-14T10:00:00Z', closed_at: '2026-05-14T11:04:00Z' };
    const summary = generateSessionSummary(input);
    expect(summary.duration_human).toBe('1 hr 4 min');
  });

  it('picks salient events', () => {
    const summary = generateSessionSummary(base);
    expect(summary.salient_events).toEqual(['wound_cleaned', 'dressing_applied', 'gloves_on']);
  });

  it('handles aborted session', () => {
    const input = { ...base, aborted: true };
    const summary = generateSessionSummary(input);
    expect(summary.status).toBe('aborted');
    expect(summary.what_we_saw).toMatch(/Session ended early/);
  });

  it('handles empty events', () => {
    const input = { ...base, session_events: [] };
    const summary = generateSessionSummary(input);
    expect(summary.status).toBe('fallback');
    expect(summary.what_we_saw).toMatch(/No events were recorded/);
  });

  it('handles null events', () => {
    const input = { ...base, session_events: null };
    const summary = generateSessionSummary(input);
    expect(summary.status).toBe('fallback');
    expect(summary.what_we_saw).toMatch(/No events were recorded/);
  });

  it('handles unknown scenario', () => {
    const input = { ...base, scenario: 'unknown', session_events: [
      { type: 'foo', timestamp: '2026-05-14T10:01:00Z' },
      { type: 'bar', timestamp: '2026-05-14T10:02:00Z' },
      { type: 'baz', timestamp: '2026-05-14T10:03:00Z' },
    ] };
    const summary = generateSessionSummary(input);
    expect(summary.salient_events).toEqual(['foo', 'bar', 'baz']);
  });
});
