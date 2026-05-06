'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { Circle } from 'lucide-react'
import { useCamera } from '@/hooks/use-camera'
import { usePose } from '@/hooks/use-pose'
import { useAudioSignals } from '@/hooks/use-audio-signals'
import { useRecording } from '@/hooks/use-recording'
import { useFaceLandmarks } from '@/hooks/use-face-landmarks'
import { MetricsPanel } from '@/components/metrics-panel'
import { LaneToggles } from '@/components/lane-toggles'
import { CtaPill } from '@/components/cta-pill'
import { useMembershipDrawer } from '@/components/membership-drawer'
import { drawSkeleton, drawFramingGrid } from '@/lib/pose'
import {
  postureScore,
  framingScore,
  gazeScoreFromIris,
  envelope,
  ConsistencyTracker,
} from '@/lib/signals'

const ZERO_LANES = { posture: 0, gaze: 0, framing: 0, pacing: 75 }

export default function RehearsePage() {
  const { videoRef, stream, error, isActive, start, stop } = useCamera()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { landmarks } = usePose(videoRef, isActive)
  const { pacingScore } = useAudioSignals(stream, isActive)
  const { irisLeft, irisRight } = useFaceLandmarks(videoRef, isActive)
  const { isRecording, isSupported: recordingSupported, startRecording, stopRecording } = useRecording(videoRef, canvasRef)
  const { open: openMembership } = useMembershipDrawer()
  const consistencyRef = useRef(new ConsistencyTracker())

  const [lanes, setLanes] = useState(ZERO_LANES)
  const [envelopeScore, setEnvelopeScore] = useState(0)
  const [consistency, setConsistency] = useState(100)
  const [drift, setDrift] = useState(0)
  const [activeLanes, setActiveLanes] = useState(
    () => new Set(['posture', 'gaze', 'framing', 'pacing'])
  )

  // ⌘↵ / Ctrl↵ toggles session
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (isActive) stop(); else start()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, start, stop])

  // Draw skeleton + optional framing grid
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const w = video.clientWidth || 640
    const h = video.clientHeight || 360
    if (canvas.width !== w) canvas.width = w
    if (canvas.height !== h) canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, w, h)
    if (activeLanes.has('grid')) drawFramingGrid(ctx, w, h)
    if (landmarks.length > 0) drawSkeleton(ctx, landmarks, w, h)
  }, [landmarks, activeLanes, videoRef])

  // Compute scores on each landmark update
  useEffect(() => {
    if (!isActive || landmarks.length === 0) return
    const posture = activeLanes.has('posture') ? postureScore(landmarks) : 0
    const gaze = activeLanes.has('gaze') ? gazeScoreFromIris(irisLeft, irisRight, landmarks) : 0
    const framing = activeLanes.has('framing') ? framingScore(landmarks) : 0
    const pacing = activeLanes.has('pacing') ? pacingScore : 0
    const newLanes = { posture, gaze, framing, pacing }
    setLanes(newLanes)
    setEnvelopeScore(envelope(newLanes))
    consistencyRef.current.push([posture, gaze, framing, pacing])
    setConsistency(consistencyRef.current.score())
    setDrift(consistencyRef.current.driftTrend())
  }, [landmarks, pacingScore, irisLeft, irisRight, isActive, activeLanes])

  const handleToggle = useCallback((key: string) => {
    setActiveLanes(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }, [])

  return (
    <div style={{ display: 'flex', height: 'calc(100dvh - 3rem)', overflow: 'hidden' }}>
      {/* Input panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '16px 20px', gap: 12, overflowY: 'auto', minWidth: 0,
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>NEPA Playground</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>›</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Aura Rehearse</span>
        </div>

        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f5', margin: 0 }}>Aura Rehearse</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>
            Reflects. Rehearses. — Your private practice mirror. Nothing leaves your device.
          </p>
        </div>

        {/* 16:9 video + canvas overlay */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '16/9',
          borderRadius: 12, overflow: 'hidden',
          background: '#111111', border: '1px solid #262626', flexShrink: 0,
        }}>
          <video
            ref={videoRef}
            autoPlay playsInline muted
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', transform: 'scaleX(-1)',
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              transform: 'scaleX(-1)',
            }}
          />
          {!isActive && !error && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: '#737373', fontSize: 14 }}>Enable camera to begin</p>
            </div>
          )}
          {error && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 24px',
            }}>
              <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>
            </div>
          )}
          {isRecording && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 8px',
            }}>
              <Circle
                className="w-2.5 h-2.5 animate-pulse"
                style={{ color: '#ef4444', fill: '#ef4444' }}
              />
              <span style={{ fontSize: 11, color: '#f5f5f5' }}>REC</span>
            </div>
          )}
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['Candidate', 'Interviewer', 'Mock', 'Review'] as const).map((role, i) => (
            <button
              key={role}
              disabled={i > 0}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12,
                background: i === 0 ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: i === 0 ? '#10b981' : '#737373',
                border: '1px solid ' + (i === 0 ? 'rgba(16,185,129,0.3)' : '#262626'),
                cursor: i > 0 ? 'not-allowed' : 'default',
              }}
            >
              {role}
            </button>
          ))}
        </div>

        <LaneToggles
          activeLanes={activeLanes}
          onToggle={handleToggle}
          onOpenMembership={openMembership}
        />

        {/* CTA row + Record button (hidden on Safari iOS where captureStream is unsupported) */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <CtaPill
              isActive={isActive}
              hasPermission={!error && !!stream}
              onStart={start}
              onStop={stop}
            />
          </div>
          {isActive && recordingSupported && (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? 'Stop & download recording' : 'Record session as .webm'}
              style={{
                padding: '0 14px', borderRadius: 12,
                border: '1px solid ' + (isRecording ? 'rgba(239,68,68,0.4)' : '#262626'),
                background: isRecording ? 'rgba(239,68,68,0.12)' : '#111111',
                color: isRecording ? '#ef4444' : '#737373',
                fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Circle
                className="w-3 h-3"
                style={{
                  color: isRecording ? '#ef4444' : '#737373',
                  fill: isRecording ? '#ef4444' : 'transparent',
                }}
              />
              {isRecording ? 'Stop' : 'Record'}
            </button>
          )}
        </div>
      </div>

      {/* Metrics panel */}
      <div style={{
        width: 384, flexShrink: 0,
        borderLeft: '1px solid #262626',
        background: '#111111',
        overflowY: 'auto',
      }}>
        <MetricsPanel
          envelope={isActive ? envelopeScore : 0}
          consistency={isActive ? consistency : 100}
          drift={isActive ? drift : 0}
          lanes={isActive ? lanes : ZERO_LANES}
          isActive={isActive}
        />
      </div>
    </div>
  )
}
