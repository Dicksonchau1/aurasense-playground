// Utility to generate a deterministic session summary blob for closure screen
// See input/output contract in Prompt 3

export type SessionEvent = {
  type: string;
  timestamp: string;
  [key: string]: any;
};

export type GenerateSessionSummaryInput = {
  session_id: string;
  user_id: string;
  scenario: string;
  started_at: string;
  closed_at: string;
  aborted: boolean;
  session_events: SessionEvent[] | null;
};

export type SessionSummaryBlob = {
  duration_human: string;
  what_we_saw: string;
  status: 'completed' | 'aborted' | 'fallback';
  event_count: number;
  salient_events: string[];
  generated_at: string;
  session_id: string;
  user_id: string;
  scenario: string;
};

// Salient event types per scenario
const SALIENT_EVENT_TYPES: Record<string, string[]> = {
  wound_care: ['wound_cleaned', 'dressing_applied', 'gloves_on'],
  iv_insertion: ['needle_inserted', 'flashback_observed', 'secured'],
  cpr: ['compressions_started', 'aed_attached', 'shock_given'],
};

function formatDuration(start: string, end: string): string {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  let sec = Math.max(0, Math.floor((endMs - startMs) / 1000));
  if (sec < 1) return 'under 1 sec';
  if (sec >= 3600) {
    const hr = Math.floor(sec / 3600);
    const min = Math.floor((sec % 3600) / 60);
    return `${hr} hr${hr > 1 ? 's' : ''} ${min} min`;
  }
  if (sec >= 60) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min} min${min > 1 ? 's' : ''} ${s} sec`;
  }
  return `${sec} sec`;
}

function pickSalientEvents(
  scenario: string,
  events: SessionEvent[]
): string[] {
  const salient = SALIENT_EVENT_TYPES[scenario] || [];
  if (salient.length) {
    const found = salient.filter(type => events.some(e => e.type === type));
    if (found.length) return found;
  }
  // fallback: pick first 1–3 unique event types
  const unique = Array.from(new Set(events.map(e => e.type)));
  return unique.slice(0, 3);
}

function composeWhatWeSaw(
  salient: string[],
  eventCount: number,
  scenario: string
): string {
  if (salient.length) {
    const joined = salient.map(s => s.replace(/_/g, ' ')).join(', ');
    return `We observed: ${joined}.`;
  }
  return `We captured ${eventCount} events during the session.`;
}

export function generateSessionSummary(
  input: GenerateSessionSummaryInput
): SessionSummaryBlob {
  const { session_id, user_id, scenario, started_at, closed_at, aborted, session_events } = input;
  const now = new Date().toISOString();
  if (!session_events || !Array.isArray(session_events)) {
    return {
      duration_human: formatDuration(started_at, closed_at),
      what_we_saw: 'Session closed. No events were recorded.',
      status: 'fallback',
      event_count: 0,
      salient_events: [],
      generated_at: now,
      session_id,
      user_id,
      scenario,
    };
  }
  const eventCount = session_events.length;
  if (eventCount === 0) {
    return {
      duration_human: formatDuration(started_at, closed_at),
      what_we_saw: 'Session closed. No events were recorded.',
      status: 'fallback',
      event_count: 0,
      salient_events: [],
      generated_at: now,
      session_id,
      user_id,
      scenario,
    };
  }
  const salient = pickSalientEvents(scenario, session_events);
  let what_we_saw = composeWhatWeSaw(salient, eventCount, scenario);
  let status: 'completed' | 'aborted' = aborted ? 'aborted' : 'completed';
  if (aborted) {
    what_we_saw = `Session ended early. We captured ${eventCount} events before close.`;
  }
  return {
    duration_human: formatDuration(started_at, closed_at),
    what_we_saw,
    status,
    event_count: eventCount,
    salient_events: salient,
    generated_at: now,
    session_id,
    user_id,
    scenario,
  };
}
