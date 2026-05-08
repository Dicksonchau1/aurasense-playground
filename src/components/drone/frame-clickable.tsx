"use client"
import React from 'react'
import type { NEPARegionMeta } from '@/types/nepa'

export interface FrameClickableProps {
  row: number
  col: number
  /** reference to the live video element */
  videoRef: React.RefObject<HTMLVideoElement>
  onClickRegion: (opts: { region: NEPARegionMeta }) => void
}

export function FrameClickable({
  row,
  col,
  videoRef,
  onClickRegion,
}: FrameClickableProps) {
  const index = row * 3 + col

  function handleClick() {
    onClickRegion({ region: { row, col, index } })
  }

  return (
    <div
      onClick={handleClick}
      className="relative cursor-crosshair hover:bg-cyan-500/10 transition-colors"
      aria-label={`Region ${row + 1}-${col + 1}`}
    >
      {/* optional grid styling / overlay */}
    </div>
  )
}
