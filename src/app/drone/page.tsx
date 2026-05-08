'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FrameClickable } from '@/components/frame-clickable'
import { Plane, Battery, Signal, AlertCircle, Radio, Lock, Zap, X, ExternalLink } from 'lucide-react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { FrameClickable } from '@/components/frame-clickable'
import { YoloOverlay } from '@/components/yolo-overlay'
import { Plane, Battery, Signal, AlertCircle, Radio, Zap } from 'lucide-react'
import type { BBox } from '@/lib/yolo'

interface Drone { id: string; model: string; status: string; battery: number; region: string }

interface EdgeStats {
  p50_ms: Record<string, number>
  p95_ms: Record<string, number>
  fps: number
}

  import { useEffect, useRef } from 'react'
  function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const prev = useRef(value)
    useEffect(() => {
      if (ref.current && prev.current !== value) {
        ref.current.animate([
          { opacity: 0.6, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1.08)' },
          { opacity: 1, transform: 'scale(1)' }
        ], {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(0.4,0,0.2,1)'
        })
        prev.current = value
      }
    }, [value])
    return (
      <div className="flex flex-col gap-0.5 p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.07)', minWidth: 90 }}>
        <span className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(16,185,129,0.6)' }}>{label}</span>
        <span ref={ref} className="text-lg font-mono font-bold transition-all duration-300" style={{ color: '#10b981', letterSpacing: '0.01em' }}>{value}</span>
        {sub && <span className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{sub}</span>}
      </div>
    )
  }

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

  // V1 RTSP / edge state
  const [rtspUrl, setRtspUrl] = useState('')
  const [slotId, setSlotId] = useState<string | null>(null)
  const [streamStatus, setStreamStatus] = useState<'idle' | 'starting' | 'live' | 'stopping'>('idle')
  const [edgeStats, setEdgeStats] = useState<EdgeStats | null>(null)
  const [statsErr, setStatsErr] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simple plan resolution from /api/billing/me (no SSR needed)
  const [plan, setPlan] = useState<string>('starter')
  const [loadingPlan, setLoadingPlan] = useState(true)
  useEffect(() => {
    fetch('/api/billing/me')
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j?.plan) setPlan(j.plan) })
      .catch(() => {})
      .finally(() => setLoadingPlan(false))
  }, [])

  const canIngest = plan === 'pro' || plan === 'team' || plan === 'enterprise'

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
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play() }
      setFeedMode('webcam')
    } catch (e) { alert('Could not access camera: ' + (e as Error).message) }
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

  // ---------- RTSP edge stream -------------------------------------------

  const startPolling = useCallback((id: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/edge/stats/${id}`)
        if (!r.ok) { setStatsErr(`stats ${r.status}`); return }
        const s: EdgeStats = await r.json()
        setEdgeStats(s)
        setStatsErr(null)
      } catch (e) { setStatsErr((e as Error).message) }
    }, 2000)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [])

  useEffect(() => () => stopPolling(), [stopPolling])

  async function startRtsp() {
    if (!rtspUrl.trim()) return
    setStreamStatus('starting')
    try {
      const r = await fetch('/api/edge/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rtspUrl.trim() }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error ?? `HTTP ${r.status}`)
      setSlotId(j.slot_id)
      setStreamStatus('live')
      startPolling(j.slot_id)
    } catch (e) {
      alert('Failed to start stream: ' + (e as Error).message)
      setStreamStatus('idle')
    }
  }

  async function stopRtsp() {
    if (!slotId) return
    setStreamStatus('stopping')
    stopPolling()
    try {
      await fetch(`/api/edge/close/${slotId}`, { method: 'POST' })
    } catch {}
    setSlotId(null)
    setEdgeStats(null)
    setStreamStatus('idle')
  }

  // ---------- render -------------------------------------------------------

  const p50inf = edgeStats?.p50_ms?.inference ?? null
  const p95inf = edgeStats?.p95_ms?.inference ?? null
  const p95full = edgeStats
    ? Object.values(edgeStats.p95_ms).reduce((a, b) => a + b, 0)
    : null

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
          {!loadingPlan && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest"
              style={{ background: canIngest ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', color: canIngest ? '#10b981' : 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {plan}
            </span>
          )}
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

        {/* RTSP / SRT ingest panel */}
        <div className="mb-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            <span className="text-xs font-semibold">RTSP / SRT Edge Ingest</span>
            {!canIngest && (
              <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Lock className="w-2.5 h-2.5" /> Pro+
              </span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={rtspUrl}
              onChange={e => setRtspUrl(e.target.value)}
              disabled={!canIngest || streamStatus === 'live'}
              placeholder={canIngest ? 'rtsp://camera.local:554/stream' : 'Upgrade to Pro to enable RTSP/SRT ingest'}
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono disabled:opacity-50"
              style={{
                background: canIngest ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none',
              }}
            />

            {streamStatus === 'idle' || streamStatus === 'starting' ? (
              <button
                onClick={startRtsp}
                disabled={!canIngest || !rtspUrl.trim() || streamStatus === 'starting'}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-40"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}>
                {streamStatus === 'starting' ? 'Starting…' : 'Start stream'}
              </button>
            ) : (
              <button
                onClick={stopRtsp}
                disabled={streamStatus === 'stopping'}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 disabled:opacity-40"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                <X className="w-3 h-3" />
                {streamStatus === 'stopping' ? 'Stopping…' : 'Stop stream'}
              </button>
            )}

            {!canIngest && (
              <a href="/pricing"
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                Upgrade <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Latency HUD */}
          {streamStatus === 'live' && (
            <div className="mt-3 rounded-xl px-3 py-3 flex gap-4 flex-wrap items-stretch"
              style={{ background: 'rgba(16,185,129,0.10)', border: '1.5px solid rgba(16,185,129,0.22)', boxShadow: '0 2px 16px 0 rgba(16,185,129,0.08)' }}>
              <Stat
                label="Full pipeline p95"
                value={p95full !== null ? `${p95full.toFixed(1)} ms` : '—'}
                sub="ingest → decode → infer → encode"
              />
              <Stat
                label="Core NEPA p95"
                value={p95inf !== null ? `${p95inf.toFixed(1)} ms` : '—'}
                sub="inference only"
              />
              <Stat
                label="Core NEPA p50"
                value={p50inf !== null ? `${p50inf.toFixed(1)} ms` : '—'}
              />
              <Stat
                label="FPS"
                value={edgeStats?.fps != null ? edgeStats.fps.toFixed(1) : '—'}
              />
              {statsErr && (
                <span className="text-[10px] self-center" style={{ color: '#ef4444', alignSelf: 'flex-end' }}>⚠ {statsErr}</span>
              )}
            </div>
          )}
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
                {active} · {feedMode === 'webcam' ? 'WEBRTC' : slotId ? 'RTSP' : '4K'} · {slotId && edgeStats ? `${edgeStats.fps.toFixed(0)}fps` : '30fps'}
              </div>
              <div className="absolute top-2 right-2 z-10 flex gap-1 pointer-events-none">
                <div className="px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1"
                  style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  {slotId ? (
                    <><Zap className="w-3 h-3" /> EDGE · {p95inf != null ? `${p95inf.toFixed(0)}ms p95` : '…'}</>
                  ) : (
                    <><Signal className="w-3 h-3" /> 92%</>
                  )}
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
          {!canIngest && <> · <a href="/pricing" style={{ color: '#10b981' }}>Upgrade to Pro</a> for RTSP/SRT edge ingest.</>}
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
