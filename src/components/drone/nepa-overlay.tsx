'use client'
import type { NEPAInferenceResponse } from '@/types/nepa'

interface Props {
  overlays: Record<number, NEPAInferenceResponse>
}

/**
 * NEPAOverlay draws detection boxes and minimal world model signal.
 * It is layered on top of the video.
 *
 * IMPORTANT: It does NOT interfere with existing YOLOOverlay.
 * It simply draws a few subtle markers in a different style.
 */
export function NEPAOverlay({ overlays }: Props) {
  const entries = Object.entries(overlays)

  if (!entries.length) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {entries.map(([key, res]) => {
        const index = Number(key)
        const row   = Math.floor(index / 3)
        const col   = index % 3

        const tileStyle: React.CSSProperties = {
          gridRowStart:    row + 1,
          gridColumnStart: col + 1,
        }

        const crackScore = res.world_model.crack_score
        const sevClass =
          crackScore >= 0.85 ? 'text-red-400' :
          crackScore >= 0.65 ? 'text-amber-300' :
                               'text-emerald-300'

        return (
          <div
            key={key}
            style={tileStyle}
            className="relative grid grid-rows-1 grid-cols-1"
          >
            <div className="absolute inset-1 border border-cyan-500/40 rounded-md" />
            <div className="absolute bottom-1 left-1 right-1 bg-black/70 rounded-md px-1.5 py-1">
              <div className={`text-[9px] font-mono ${sevClass}`}>
                NEPA crack_score {(crackScore * 100).toFixed(1)}%
              </div>
              <div className="text-[8px] font-mono text-zinc-500">
                tc {(res.world_model.temporal_consistency * 100).toFixed(0)}%
                {' · '}
                ent {(res.world_model.lane_entropy * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
