'use client'
import React, { useRef, useState } from 'react'
import { captureVideoFrame, regionRect } from '@/lib/capture-frame'
import { dispatchFrame } from '@/lib/nepa-bus'
import { Crosshair, Loader2 } from 'lucide-react'

interface Props {
  children: React.ReactNode
  source?: string
  /** If true, a single click captures the FULL frame; otherwise 3x3 grid regions. */
  fullFrameOnClick?: boolean
  className?: string
  style?: React.CSSProperties
}

const REGIONS = ['NW','N','NE','W','C','E','SW','S','SE']

export function FrameClickable({ children, source = 'feed', fullFrameOnClick, className, style }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  function findVideo(): HTMLVideoElement | null {
    return wrapRef.current?.querySelector('video') ?? null
  }

  async function grab(region?: string) {
    const video = findVideo()
    if (!video) { console.warn('[FrameClickable] no <video> child'); return }
    if (!video.videoWidth) { console.warn('[FrameClickable] video not ready'); return }

    setBusy(region ?? 'full')
    try {
      const rect = region ? regionRect(region, video.videoWidth, video.videoHeight) : undefined
      const frame = await captureVideoFrame(video, { region: rect, quality: 0.85 })
      dispatchFrame(frame, source)
      setFlash(region ?? 'full')
      setTimeout(() => setFlash(null), 700)
    } catch (err) {
      console.error('[FrameClickable] capture failed', err)
      alert('Frame capture failed: ' + (err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className ?? ''}`}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}

      {fullFrameOnClick ? (
        <button
          onClick={() => grab()}
          aria-label="Capture full frame for NEPA inference"
          className="absolute inset-0 z-20 transition-all"
          style={{
            background: flash === 'full' ? 'rgba(16,185,129,0.18)' : 'transparent',
            cursor: busy ? 'wait' : 'crosshair',
          }}
        >
          {hover && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-[9px] font-mono pointer-events-none flex items-center gap-1"
              style={{ background: 'rgba(7,14,26,0.85)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', backdropFilter: 'blur(6px)' }}>
              {busy ? <><Loader2 className="w-3 h-3 animate-spin" /> Capturing…</> : <><Crosshair className="w-3 h-3" /> Click to capture & infer</>}
            </span>
          )}
        </button>
      ) : (
        <>
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-20">
            {REGIONS.map(region => (
              <button
                key={region}
                onClick={(e) => { e.stopPropagation(); grab(region) }}
                aria-label={`Capture region ${region}`}
                disabled={!!busy}
                className="group relative transition-all"
                style={{
                  background: flash === region ? 'rgba(16,185,129,0.25)' : 'transparent',
                  border: hover ? '1px solid rgba(16,185,129,0.18)' : '1px solid transparent',
                  cursor: busy ? 'wait' : 'crosshair',
                }}
              >
                <span className="absolute top-1 left-1 text-[8px] font-mono font-bold px-1 rounded transition-opacity"
                  style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981', opacity: hover ? 0.85 : 0 }}>
                  {region}
                </span>
                {busy === region && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#10b981' }} />
                  </span>
                )}
              </button>
            ))}
          </div>
          {hover && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 px-2 py-1 rounded-full text-[9px] font-mono pointer-events-none"
              style={{ background: 'rgba(7,14,26,0.85)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', backdropFilter: 'blur(6px)' }}>
              Click any 9-region tile to capture & infer
            </div>
          )}
        </>
      )}
    </div>
  )
}
