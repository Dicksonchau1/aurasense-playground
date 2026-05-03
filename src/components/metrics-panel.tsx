'use client'

interface LaneScores {
  posture: number
  gaze: number
  framing: number
  pacing: number
}

interface MetricsPanelProps {
  envelope: number
  consistency: number
  drift: number
  lanes: LaneScores
  isActive: boolean
}

const TIPS: Record<keyof LaneScores, string[]> = {
  posture: [
    'Keep your shoulders level and back straight.',
    'Avoid leaning to one side during your response.',
    'A balanced posture signals composed self-presentation.',
  ],
  gaze: [
    'Look directly at the camera lens, not the screen.',
    'Reduce side-glancing by placing notes near the webcam.',
    'Consistent gaze direction improves coherence perception.',
  ],
  framing: [
    'Position your face in the upper-center third of the frame.',
    'Ensure even headroom above your head.',
    'Move closer or further until the score improves.',
  ],
  pacing: [
    'Allow brief pauses between thoughts — silence is practice.',
    'Aim to speak about 60–70% of the session duration.',
    'Vary sentence rhythm to maintain coherent delivery.',
  ],
}

function LaneBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</span>
        <span className="text-sm font-mono font-medium" style={{ color: 'var(--text)' }}>{score}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${score}%`,
            background: score > 70 ? 'var(--accent-green)' : score > 40 ? 'var(--accent-amber)' : 'var(--lock-red)',
          }}
        />
      </div>
    </div>
  )
}

export function MetricsPanel({ envelope, consistency, drift, lanes, isActive }: MetricsPanelProps) {
  const lowestLane = (Object.entries(lanes) as [keyof LaneScores, number][]).sort((a, b) => a[1] - b[1])[0]
  const tip = lowestLane ? TIPS[lowestLane[0]][Math.floor(Date.now() / 5000) % TIPS[lowestLane[0]].length] : null

  return (
    <div className="flex flex-col h-full p-4">
      {/* Tab row */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: 'var(--bg)' }}>
        {['Envelope', 'Lanes', 'Tips'].map(tab => (
          <button
            key={tab}
            className="flex-1 text-xs py-1.5 rounded-md transition-colors"
            style={{
              background: tab === 'Envelope' ? 'var(--panel)' : 'transparent',
              color: tab === 'Envelope' ? 'var(--text)' : 'var(--muted)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Envelope card */}
      <div className="rounded-xl p-5 mb-4 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Envelope</p>
        <div className="flex items-end gap-2 mb-2">
          <span
            aria-live="polite"
            className="text-6xl font-bold tabular-nums"
            style={{ color: isActive ? 'var(--text)' : 'var(--muted)' }}
          >
            {envelope}
          </span>
          <span className="text-xl mb-2" style={{ color: 'var(--muted)' }}>/ 100</span>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted)' }}>Consistency</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text)' }}>{consistency}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>/ 100</span>
              <span className="text-xs ml-1" style={{ color: 'var(--accent-green)' }}>✓ coherent</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              drift {drift >= 0 ? '+' : ''}{drift} {drift >= 0 ? '↗ improving' : '↘ declining'}
            </span>
          </div>
        </div>
      </div>

      {/* Lane bars */}
      <div className="rounded-xl p-4 mb-4 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        <LaneBar label="Posture" score={lanes.posture} />
        <LaneBar label="Gaze" score={lanes.gaze} />
        <LaneBar label="Framing" score={lanes.framing} />
        <LaneBar label="Pacing" score={lanes.pacing} />
      </div>

      {/* Tip */}
      {tip && (
        <div className="rounded-xl p-4 border flex-1" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Adaptive tip</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{tip}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
            Focus area: <span style={{ color: 'var(--accent-amber)' }}>{lowestLane?.[0]}</span>
          </p>
        </div>
      )}

      {/* Pro footer */}
      <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 border"
          style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
          data-open-membership
        >
          Unlock Rehearse Pro — HK$108/month
        </button>
      </div>
    </div>
  )
}
