'use client'
import { Lock } from 'lucide-react'

interface LaneTogglesProps {
  activeLanes: Set<string>
  onToggle: (key: string) => void
  onOpenMembership: () => void
}

const ACTIVE_LANES = [
  { key: 'posture', label: 'Posture' },
  { key: 'gaze', label: 'Gaze' },
  { key: 'framing', label: 'Framing' },
  { key: 'pacing', label: 'Pacing' },
  { key: 'grid', label: 'Framing Grid' },
]

const LOCKED_LANES = [
  { key: 'avatar', label: 'Aura Avatar' },
  { key: 'lipsync', label: 'Lip-sync', badge: 'V2' },
  { key: 'history', label: 'Session history' },
]

export function LaneToggles({ activeLanes, onToggle, onOpenMembership }: LaneTogglesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIVE_LANES.map(lane => {
        const on = activeLanes.has(lane.key)
        return (
          <button
            key={lane.key}
            onClick={() => onToggle(lane.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: on ? 'rgba(16,185,129,0.15)' : 'var(--panel)',
              color: on ? 'var(--accent-green)' : 'var(--muted)',
              border: '1px solid ' + (on ? 'rgba(16,185,129,0.3)' : 'var(--border)'),
            }}
          >
            <span>{on ? '✓' : '○'}</span>{lane.label}
          </button>
        )
      })}
      {LOCKED_LANES.map(lane => (
        <button
          key={lane.key}
          onClick={onOpenMembership}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'var(--panel)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          <Lock className="w-3 h-3" style={{ color: 'var(--lock-red)' }} />
          {lane.label}
          {'badge' in lane && lane.badge && <span className="opacity-60">{lane.badge}</span>}
        </button>
      ))}
    </div>
  )
}
