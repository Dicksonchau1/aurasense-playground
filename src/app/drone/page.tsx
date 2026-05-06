'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { FrameClickable } from '@/components/frame-clickable'
import { YoloOverlay } from '@/components/yolo-overlay'
import { Plane, Battery, Signal, AlertCircle, Radio, Zap } from 'lucide-react'
import type { BBox } from '@/lib/yolo'

interface Drone { id: string; model: string; status: string; battery: number; region: string }

export default function DronePage() {
  const [drones, setDrones] = useState<Drone[]>([])
  const [active, setActive] = useState<string>('UAV-001')
  const [feedMode, setFeedMode] = useState<'video' | 'webcam'>('video')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  // YOLO state
  const [yoloReady, setYoloReady] = useState(false)
  const [yoloError, setYoloError] = useState('')
  const [boxes, setBoxes] = useState<BBox[]>([])
  const [fps, setFps] = useState(0)
  const [latencyMs, setLatencyMs] = useState(0)
  const [videoSize, setVideoSize] = useState({ w: 1280, h: 720 })
  const inferringRef = useRef(false)

  useEffect(() => {
    fetch('/api/registry/drones').then(r => r.json()).then(j => setDrones(j?.data?.units ?? []))
      .catch(() => {})
  }, [])

  // Load YOLO on mount (dynamic import to avoid SSR)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { initYolo } = await import('@/lib/yolo')
        await initYolo()
        if (!cancelled) setYoloReady(true)
      } catch (e) {
        if (!cancelled) setYoloError((e as Error).message)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // Inference loop — runs when webcam is attached and YOLO is ready
  const runLoop = useCallback(async () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runLoop)
      return
    }
    if (inferringRef.current) {
      rafRef.current = requestAnimationFrame(runLoop)
      return
    }
    inferringRef.current = true
    const t0 = performance.now()
    try {
      const { runYoloInference } = await import('@/lib/yolo')
      const detected = await runYoloInference(video)
      const t1 = performance.now()
      const elapsed = t1 - t0
      setBoxes(detected)
      setLatencyMs(Math.round(elapsed))
      setFps(Math.round(1000 / elapsed))
      setVideoSize({ w: video.videoWidth || 1280, h: video.videoHeight || 720 })
    } catch {
      // Swallow per-frame errors silently
    }
    inferringRef.current = false
    rafRef.current = requestAnimationFrame(runLoop)
  }, [])

  // Start/stop inference loop based on webcam state and YOLO readiness
  useEffect(() => {
    if (feedMode === 'webcam' && yoloReady) {
      rafRef.current = requestAnimationFrame(runLoop)
    } else {
      cancelAnimationFrame(rafRef.current)
      setBoxes([])
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [feedMode, yoloReady, runLoop])

  async function attachWebcam() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      streamRef.current = s
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
      }
      setFeedMode('webcam')
    } catch (e) {
      alert('Could not access camera: ' + (e as Error).message)
    }
  }
  function detachWebcam() {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setFeedMode('video')
    setBoxes([])
  }
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-4 h-4" style={{ color: '#10b981' }} />
          <h1 className="text-2xl font-bold">Drone Console</h1>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            LIVE · HK-KLN-1
          </span>
          <div className="ml-auto flex gap-2">
            {feedMode === 'video' ? (
              <button onClick={attachWebcam}
                className="px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                <Radio className="w-3 h-3" /> Attach live camera
              </button>
            ) : (
              <button onClick={detachWebcam}
                className="px-2 py-1 rounded-md text-[10px] font-bold"
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                Detach camera
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
          {/* Live feed */}
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <FrameClickable source={`drone-${active}`} style={{ aspectRatio: '16/9', background: '#000' }}>
              <video
                ref={videoRef}
                src={feedMode === 'video' ? '/hero/world-model-stdp.mp4' : undefined}
                autoPlay loop muted playsInline crossOrigin="anonymous"
                onError={(e) => {
                  const v = e.currentTarget
                  if (feedMode === 'video' && !v.src.endsWith('/hero/scene-builder.mp4')) v.src = '/hero/scene-builder.mp4'
                }}
                className="w-full h-full object-cover"
              />
              {/* YOLO bounding box overlay — only active in webcam mode */}
              {feedMode === 'webcam' && yoloReady && (
                <YoloOverlay
                  boxes={boxes}
                  videoWidth={videoSize.w}
                  videoHeight={videoSize.h}
                  style={{ zIndex: 10 }}
                />
              )}
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-mono pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                {active} · {feedMode === 'webcam' ? 'WEBRTC' : '4K'} · 30fps
              </div>
              <div className="absolute top-2 right-2 z-10 flex gap-1 pointer-events-none">
                <div className="px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1"
                  style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  <Signal className="w-3 h-3" /> 92%
                </div>
                {feedMode === 'webcam' && yoloReady && (
                  <div className="px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1"
                    style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                    <Zap className="w-3 h-3" />
                    {fps} FPS · {latencyMs}ms · {boxes.length} obj
                  </div>
                )}
              </div>
              {feedMode === 'webcam' && !yoloReady && !yoloError && (
                <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-mono"
                  style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.5)' }}>
                  Loading YOLOv8n model…
                </div>
              )}
              {yoloError && (
                <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-mono"
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                  YOLO: {yoloError}
                </div>
              )}
            </FrameClickable>
          </div>

          {/* Fleet list + inference stats */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(16,185,129,0.7)' }}>Fleet</p>
            {drones.map(d => {
              const isActive = active === d.id
              const alert = d.status === 'alert'
              return (
                <button key={d.id} onClick={() => setActive(d.id)}
                  className="w-full text-left rounded-xl p-3 transition-all"
                  style={{
                    background: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                    border: isActive ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <div className="flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5" style={{ color: alert ? '#f59e0b' : '#10b981' }} />
                    <p className="text-xs font-semibold">{d.id}</p>
                    {alert && <AlertCircle className="w-3 h-3" style={{ color: '#f59e0b' }} />}
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{d.model} · {d.status}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Battery className="w-3 h-3" style={{ color: d.battery < 50 ? '#f59e0b' : '#10b981' }} />
                    <div className="flex-1 h-1 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded" style={{ width: `${d.battery}%`, background: d.battery < 50 ? '#f59e0b' : '#10b981' }} />
                    </div>
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.battery}%</span>
                  </div>
                </button>
              )
            })}
            {drones.length === 0 && (
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading fleet…</p>
            )}

            {/* Inference metrics panel */}
            {feedMode === 'webcam' && (
              <div className="rounded-xl p-3 mt-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(245,158,11,0.7)' }}>
                  YOLOv8n Inference
                </p>
                <div className="space-y-1">
                  <MetricRow label="Status" value={yoloReady ? '● Ready' : '○ Loading'} color={yoloReady ? '#10b981' : '#f59e0b'} />
                  <MetricRow label="FPS" value={`${fps}`} color="#f5f5f5" />
                  <MetricRow label="Latency" value={`${latencyMs} ms`} color="#f5f5f5" />
                  <MetricRow label="Objects" value={`${boxes.length}`} color="#f5f5f5" />
                  {boxes.slice(0, 3).map((b, i) => (
                    <MetricRow
                      key={i}
                      label={`  ${b.className}`}
                      value={`${Math.round(b.confidence * 100)}%`}
                      color="rgba(255,255,255,0.5)"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Click any 9-region tile on the live feed — actual pixels are captured and POSTed to <code>/api/nepa/inference/frame</code>.
          Attach live camera to enable YOLOv8n real-time object detection.
        </p>
      </section>
    </main>
  )
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}</span>
    </div>
  )
}
