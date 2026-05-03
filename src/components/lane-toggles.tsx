'use client'
import { Lock } from 'lucide-react'

interface LaneToggle {
  key: string
  label: string
  enabled: boolean
  locked?: boolean
  lockedLabel?: string
}

interface LaneTogglesProps {
  onOpenMembership: () => void
}

const LANES: LaneToggle[] = [
  { key: 'posture', label: 'Posture', enabled: true },
  { key: 'gaze', label: 'Gaze', enabled: true },
  { key: 'framing', label: 'Framing', enabled: true },
  { key: 'pacing', label: 'Pacing', enabled: true },
  { key: 'avatar', label: 'Aura Avatar', enabled: false, locked: true },
  { key: 'lipsync', label: 'Lip-sync', enabled: false, locked: true, lockedLabel: 'V2' },
  { key: 'history', label: 'Session history', enabled: false, locked: true },
]

export function LaneToggles({ onOpenMembership }: LaneTogglesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANES.map(lane => (
        <button
          key={lane.key}
          onClick={lane.locked ? onOpenMembership : undefined}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-opacity"
          style={{
            background: lane.enabled ? 'rgba(16,185,129,0.15)' : 'var(--panel)',
            color: lane.enabled ? 'var(--accent-green)' : 'var(--muted)',
            border: `1px solid ${lane.enabled ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
            cursor: lane.locked ? 'pointer' : 'default',
          }}
        >
          {lane.locked ? (
            <>
              <Lock className="w-3 h-3" style={{ color: 'var(--lock-red)' }} />
              {lane.label}
              {lane.lockedLabel && <span className="text-xs opacity-60">{lane.lockedLabel}</span>}
            </>
          ) : (
            <>
              <span>✓</span>
              {lane.label}
            </>
          )}
        </button>
      ))}
    </div>
  )
}
