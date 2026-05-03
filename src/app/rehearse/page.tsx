'use client'
import { useRef, useState, useEffect } from 'react'
import { PlaygroundShell } from '@/components/playground-shell'
import { MetricsPanel } from '@/components/metrics-panel'
import { LaneToggles } from '@/components/lane-toggles'
import { CtaPill } from '@/components/cta-pill'
import { MembershipDrawer } from '@/components/membership-drawer'
import { useCamera } from '@/hooks/use-camera'
import { usePose } from '@/hooks/use-pose'
import { useAudioSignals } from '@/hooks/use-audio-signals'
import { postureScore, framingScore, gazeScore, envelope, ConsistencyTracker } from '@/lib/signals'
import { drawSkeleton } from '@/lib/pose'

export default function RehearsePage() {
  const { videoRef, stream, error, isActive, start, stop } = useCamera()
  const { landmarks } = usePose(videoRef, isActive)
  const { pacingScore } = useAudioSignals(stream, isActive)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const consistencyRef = useRef(new ConsistencyTracker())
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [scores, setScores] = useState({
    posture: 0, gaze: 0, framing: 0, pacing: 75,
    envelope: 0, consistency: 100, drift: 0,
  })

  useEffect(() => {
    if (!isActive || landmarks.length === 0) return
    const posture = Math.round(postureScore(landmarks))
    const gaze = Math.round(gazeScore(landmarks))
    const framing = Math.round(framingScore(landmarks))
    const pacing = pacingScore
    consistencyRef.current.push([posture, gaze, framing])
    const consistency = consistencyRef.current.score()
    const drift = consistencyRef.current.driftTrend()
    const envelopeScore = envelope({ posture, gaze, framing, pacing })
    setScores({ posture, gaze, framing, pacing, envelope: envelopeScore, consistency, drift })
  }, [landmarks, pacingScore, isActive])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (landmarks.length > 0) {
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720
      drawSkeleton(ctx, landmarks, canvas.width, canvas.height)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [landmarks, videoRef])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        isActive ? stop() : start()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isActive, start, stop])

  const metrics = (
    <div onClick={e => {
      if ((e.target as HTMLElement).closest('[data-open-membership]')) setDrawerOpen(true)
    }}>
      <MetricsPanel
        envelope={isActive ? scores.envelope : 0}
        consistency={isActive ? scores.consistency : 100}
        drift={isActive ? scores.drift : 0}
        lanes={{ posture: isActive ? scores.posture : 0, gaze: isActive ? scores.gaze : 0, framing: isActive ? scores.framing : 0, pacing: isActive ? scores.pacing : 75 }}
        isActive={isActive}
      />
    </div>
  )

  return (
    <PlaygroundShell metrics={metrics}>
      <div className="p-6 max-w-3xl">
        <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
          NEPA Playground <span className="mx-1">›</span> Aura Rehearse
        </p>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Aura Rehearse</h1>
        <p className="text-base mb-1" style={{ color: 'var(--accent-green)' }}>Reflects. Rehearses.</p>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Your private practice mirror. Nothing leaves your device.
        </p>

        <div
          className="relative w-full rounded-xl overflow-hidden mb-4"
          style={{ aspectRatio: '16/9', background: 'var(--panel)', border: '1px solid var(--border)' }}
        >
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Enable camera to begin</p>
            </div>
          )}
          {error && (
            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-3">
          {['Candidate', 'Interviewer', 'Mock', 'Review'].map(role => (
            <button key={role} disabled={role !== 'Candidate'}
              className="px-3 py-1.5 rounded-full text-xs border transition-colors"
              style={{
                background: role === 'Candidate' ? 'rgba(16,185,129,0.15)' : 'transparent',
                borderColor: role === 'Candidate' ? 'rgba(16,185,129,0.4)' : 'var(--border)',
                color: role === 'Candidate' ? 'var(--accent-green)' : 'var(--muted)',
                cursor: role !== 'Candidate' ? 'not-allowed' : 'pointer',
              }}
            >{role}</button>
          ))}
        </div>

        <div className="mb-4">
          <LaneToggles onOpenMembership={() => setDrawerOpen(true)} />
        </div>

        <CtaPill isActive={isActive} hasPermission={!!stream && !error} onStart={start} onStop={stop} />

        {error && (
          <p className="text-xs mt-2" style={{ color: 'var(--lock-red)' }}>
            Camera permission required. Please allow access and try again.
          </p>
        )}
      </div>

      <MembershipDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </PlaygroundShell>
  )
}
