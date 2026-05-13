'use client';

'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Circle, Save } from 'lucide-react';
import { useCamera } from '@/components/hooks/use-camera';
import { usePose } from '@/components/hooks/use-pose';
import { useAudioSignals } from '@/components/hooks/use-audio-signals';
import { useRecording } from '@/components/hooks/use-recording';
import { useFaceLandmarks } from '@/components/hooks/use-face-landmarks';
import { MetricsPanel } from '@/components/metrics-panel';
import { LaneToggles } from '@/components/lane-toggles';
import { CtaPill } from '@/components/cta-pill';
import { useMembershipDrawer } from '@/components/membership-drawer';
import { drawSkeleton, drawFramingGrid } from '@/lib/pose';
import {
  postureScore,
  framingScore,
  gazeScoreFromIris,
  envelope,
  ConsistencyTracker,
} from '@/lib/signals';
import { StatePill } from '@/components/ui/StatePill';
import { FallbackRibbon } from '@/components/ui/FallbackRibbon';

const SCENARIO_HINTS: Record<string, string[][]> = {
  basic: [
    ['Sanitize hands before patient contact.'],
    ['Confirm patient identity using wristband and verbal check.'],
    ['Introduce yourself and explain the procedure.'],
    ['Measure and record vital signs: BP, HR, Temp, SpO2.'],
    ['Document findings in the EHR.'],
  ],
  wound: [
    ['Inspect wound for stage, exudate, infection.'],
    ['Capture a clear wound photo for record.'],
    ['Select appropriate dressing based on wound profile.'],
    ['Apply dressing using aseptic technique.'],
    ['Record intervention and review healing trajectory.'],
  ],
  mobility: [
    ['Assess fall risk factors.'],
    ['Evaluate patient mobility and gait.'],
    ['Choose and fit assistive device if needed.'],
    ['Supervise patient during walk.'],
    ['Document outcome and recommendations.'],
  ],
  neuro: [
    ['Check orientation to person, place, time.'],
    ['Assess pupil size and reactivity.'],
    ['Test limb strength and movement.'],
    ['Evaluate speech clarity and comprehension.'],
    ['Summarize findings and escalate if abnormal.'],
  ],
  custom: [
    ['Custom step 1 instructions.'],
    ['Custom step 2 instructions.'],
    ['Custom step 3 instructions.'],
    ['Custom step 4 instructions.'],
    ['Custom step 5 instructions.'],
  ],
};

const SCENARIO_STEPS: Record<string, string[]> = {
  basic: [
    'Hand Hygiene',
    'Patient ID Check',
    'Bedside Introduction',
    'Vital Signs',
    'Documentation',
  ],
  wound: [
    'Wound Assessment',
    'Photo Capture',
    'Dressing Selection',
    'Dressing Application',
    'Record & Review',
  ],
  mobility: [
    'Fall Risk Check',
    'Mobility Assessment',
    'Assistive Device',
    'Supervised Walk',
    'Outcome Record',
  ],
  neuro: [
    'Orientation',
    'Pupil Response',
    'Motor Function',
    'Speech',
    'Summary',
  ],
  custom: [
    'Custom Step 1',
    'Custom Step 2',
    'Custom Step 3',
    'Custom Step 4',
    'Custom Step 5',
  ],
};

const FACADE_IMAGES = {
  residential: 'https://picsum.photos/seed/hk-residential-tower/1200/800',
  commercial:  'https://picsum.photos/seed/hk-commercial-glass/1200/800',
  heritage:    'https://picsum.photos/seed/hk-heritage-concrete/1200/800',
  industrial:  'https://picsum.photos/seed/hk-industrial-factory/1200/800',
};

const SCENARIOS = [
  { key: 'basic', label: 'Basic Bedside' },
  { key: 'wound', label: 'Wound Care' },
  { key: 'mobility', label: 'Mobility Assessment' },
  { key: 'neuro', label: 'Neuro Check' },
  { key: 'custom', label: 'Custom Scenario' },
];

const ZERO_LANES = { posture: 0, gaze: 0, framing: 0, pacing: 75 };

export default function RehearsePage() {
  const router = useRouter();
  const { videoRef, stream, error, isActive, start, stop } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { landmarks } = usePose(videoRef, isActive);
  const { pacingScore } = useAudioSignals(stream, isActive);
  const { irisLeft, irisRight } = useFaceLandmarks(videoRef, isActive);
  const { isRecording, isSupported: recordingSupported, startRecording, stopRecording } = useRecording(videoRef, canvasRef);
  const { open: openMembership } = useMembershipDrawer();
  const consistencyRef = useRef(new ConsistencyTracker());

  const [lanes, setLanes] = useState(ZERO_LANES);
  const [envelopeScore, setEnvelopeScore] = useState(0);
  const [consistency, setConsistency] = useState(100);
  const [drift, setDrift] = useState(0);
  const [activeLanes, setActiveLanes] = useState(() => new Set(['posture', 'gaze', 'framing', 'pacing']));
  const [saving, setSaving] = useState(false);
  const sessionStartRef = useRef<number>(Date.now());
  // Platform/session state for pill and fallback
  const [sessionStatus, setSessionStatus] = useState<'live' | 'degraded' | 'offline' | 'empty'>('live');

  // Step state (ensure only one definition)
  const [scenario, setScenario] = useState('basic');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(() => {
    const obj: Record<string, boolean[]> = {};
    for (const s of Object.keys(SCENARIO_STEPS)) {
      obj[s] = Array(SCENARIO_STEPS[s].length).fill(false);
    }
    return obj;
  });
  // Only allow advancing if current step is marked complete
  const canAdvance = completedSteps[scenario][currentStep];

  useEffect(() => {
    if (isActive) sessionStartRef.current = Date.now()
  }, [isActive])

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

  // Draw skeleton + optional framing grid with animation
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

    // Facade overlay grid (if enabled)
    if (facadeMode) {
      ctx.save()
      ctx.globalAlpha = 0.7
      drawFramingGrid(ctx, w, h)
      ctx.restore()
      // Idle label
      ctx.save()
      ctx.fillStyle = 'rgba(63,184,192,0.4)'
      ctx.font = `500 12px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.fillText('NEPA v1 · Façade Ready · Press ▶ Run Inspection', w/2, h - 20)
      ctx.restore()
    }

    // Animate skeleton with a pulse effect
    if (landmarks.length > 0) {
      ctx.save()
      const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 300)
      ctx.globalAlpha = pulse
      drawSkeleton(ctx, landmarks, w, h)
      ctx.restore()
    }
    // Draw a modern HUD overlay (corners, subtle border)
    ctx.save()
    ctx.strokeStyle = 'rgba(16,185,129,0.25)'
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, w - 4, h - 4)
    ctx.restore()
  }, [landmarks, activeLanes, videoRef, facadeMode])

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

  // Session save: snapshot → Supabase storage → insert row → navigate
  async function handleSaveSession() {
    if (saving) return
    setSaving(true)
    try {
      let snapshotUrl: string | null = null

      // Capture snapshot from video element via html2canvas-like canvas trick
      const video = videoRef.current
      if (video && video.readyState >= 2) {
        const snapCanvas = document.createElement('canvas')
        snapCanvas.width = video.videoWidth || 640
        snapCanvas.height = video.videoHeight || 360
        const ctx = snapCanvas.getContext('2d')
        if (ctx) {
          ctx.save()
          ctx.scale(-1, 1)
          ctx.drawImage(video, -snapCanvas.width, 0, snapCanvas.width, snapCanvas.height)
          ctx.restore()
          const blob = await new Promise<Blob | null>(res => snapCanvas.toBlob(res, 'image/jpeg', 0.85))
          if (blob) {
            const { createClient } = await import('@/lib/supabase/client')
            const sb = createClient()
            const { data: { user } } = await sb.auth.getUser()
            if (user) {
              const path = `${user.id}/${Date.now()}.jpg`
              const { data: uploadData, error: uploadErr } = await sb.storage
                .from('snapshots')
                .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
              if (!uploadErr && uploadData) {
                const { data: { publicUrl } } = sb.storage.from('snapshots').getPublicUrl(uploadData.path)
                snapshotUrl = publicUrl
              }
            }
          }
        }
      }

      const duration_sec = Math.round((Date.now() - sessionStartRef.current) / 1000)
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lane: 'rehearse',
          envelope: envelopeScore,
          consistency,
          lanes,
          snapshot_url: snapshotUrl,
          duration_sec,
        }),
      })
      const json = await res.json()
      if (json.id) {
        router.push(`/rehearse/${json.id}`)
      } else {
        // Not logged in — navigate to login
        router.push('/login')
      }
    } catch (e) {
      console.error('Save session failed', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3rem)] overflow-hidden bg-neutral-950">
      {/* Input panel */}
      <div className="flex flex-col flex-1 min-w-0 gap-3 py-4 px-5 overflow-y-auto">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>NEPA Playground</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>›</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Aura Rehearse</span>
        </div>


        <div className="flex items-center gap-3">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f5', margin: 0 }}>Aura Rehearse</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>
              Reflects. Rehearses. — Your private practice mirror. Nothing leaves your device.
            </p>
          </div>
          <StatePill status={sessionStatus} />
        </div>

        {/* Scenario selection */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-neutral-400">Scenario:</span>
          <select
            value={scenario}
            onChange={e => {
              setScenario(e.target.value)
              setCurrentStep(0)
              // Optionally reset completed steps for new scenario
              setCompletedSteps(prev => ({
                ...prev,
                [e.target.value]: prev[e.target.value].map(() => false),
              }))
            }}
            className="text-xs rounded border border-emerald-900 bg-neutral-900 text-neutral-200 px-2 py-1"
          >
            {SCENARIOS.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Step rail for current scenario */}
        <div className="flex items-center gap-2 mt-2">
          {SCENARIO_STEPS[scenario].map((step, idx) => (
            <button
              key={step}
              onClick={() => {
                // Only allow navigating to next step if previous is complete or going backward
                if (idx <= currentStep || completedSteps[scenario][idx - 1]) setCurrentStep(idx)
              }}
              className={`text-xs px-2 py-1 rounded border ${idx === currentStep ? 'bg-emerald-900 text-emerald-300 border-emerald-700 font-bold' : 'bg-neutral-900 text-neutral-300 border-neutral-700'} transition ${completedSteps[scenario][idx] ? 'ring-2 ring-emerald-400' : ''}`}
              style={{ minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: idx > currentStep && !completedSteps[scenario][idx - 1] ? 'not-allowed' : 'pointer', opacity: idx > currentStep && !completedSteps[scenario][idx - 1] ? 0.5 : 1 }}
            >
              {step}
            </button>
          ))}
        </div>

        {/* Scenario/step-specific instructions and validation */}
        <div className="mb-2 mt-2 p-3 rounded bg-neutral-900 border border-emerald-900">
          <div className="text-xs text-emerald-300 font-semibold mb-1">
            {SCENARIO_STEPS[scenario][currentStep]}
          </div>
          <div className="text-xs text-neutral-300 mb-2">
            {SCENARIO_HINTS[scenario][currentStep].map((hint, i) => (
              <div key={i}>{hint}</div>
            ))}
          </div>
          {!completedSteps[scenario][currentStep] && (
            <button
              className="text-xs px-3 py-1 rounded bg-emerald-800 text-white font-semibold border border-emerald-600 hover:bg-emerald-700 transition"
              onClick={() => setCompletedSteps(prev => ({
                ...prev,
                [scenario]: prev[scenario].map((v, i) => i === currentStep ? true : v),
              }))}
            >
              Complete Step
            </button>
          )}
        </div>

        {/* 16:9 video + canvas overlay */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-emerald-900 bg-neutral-900 flex-shrink-0">
          {/* Facade image (if overlay enabled) */}
          {facadeMode && (
            <img
              src={FACADE_IMAGES[facadeType]}
              alt="Facade"
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{ filter: 'brightness(0.85) blur(0.5px)' }}
              draggable={false}
            />
          )}
          <video
            ref={videoRef}
            autoPlay playsInline muted
            className="absolute inset-0 w-full h-full object-cover z-10"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            style={{ transform: 'scaleX(-1)' }}
          />
          {/* Overlay: camera not active */}
          {!isActive && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <p className="text-neutral-400 text-sm">Enable camera to begin</p>
            </div>
          )}
          {/* Overlay: error */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-30 px-6">
              <FallbackRibbon message={error} status="degraded" />
            </div>
          )}
          {/* Overlay: recording */}
          {isRecording && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded px-2 py-1 z-30">
              <Circle className="w-2.5 h-2.5 animate-pulse text-red-500 fill-red-500" />
              <span className="text-xs text-white">REC</span>
            </div>
          )}
        </div>
        {/* Facade overlay controls */}
        <div className="flex items-center gap-3 mt-1">
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            <input type="checkbox" checked={facadeMode} onChange={e => setFacadeMode(e.target.checked)} className="accent-emerald-500" />
            Facade Overlay
          </label>
          {facadeMode && (
            <select value={facadeType} onChange={e => setFacadeType(e.target.value)} className="text-xs rounded border border-emerald-900 bg-neutral-900 text-neutral-200 px-2 py-1">
              {Object.keys(FACADE_IMAGES).map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
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
              onStart={currentStep === SCENARIO_STEPS[scenario].length - 1 ? () => {
                // Mark all steps as completed for this scenario
                setCompletedSteps(prev => ({
                  ...prev,
                  [scenario]: prev[scenario].map(() => true),
                }))
                start()
              } : undefined}
              onStop={stop}
            />
          </div>
          {isActive && recordingSupported && (
            <button
              onClick={currentStep === SCENARIO_STEPS[scenario].length - 1 ? (isRecording ? stopRecording : startRecording) : undefined}
              title={isRecording ? 'Stop & download recording' : 'Record session as .webm'}
              style={{
                padding: '0 14px', borderRadius: 12,
                border: '1px solid ' + (isRecording ? 'rgba(239,68,68,0.4)' : '#262626'),
                background: isRecording ? 'rgba(239,68,68,0.12)' : '#111111',
                color: isRecording ? '#ef4444' : '#737373',
                fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: currentStep === SCENARIO_STEPS[scenario].length - 1 ? 'pointer' : 'not-allowed', flexShrink: 0,
                opacity: currentStep === SCENARIO_STEPS[scenario].length - 1 ? 1 : 0.5,
              }}
              disabled={currentStep !== SCENARIO_STEPS[scenario].length - 1}
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
          {isActive && (
            <button
              onClick={currentStep === SCENARIO_STEPS[scenario].length - 1 ? handleSaveSession : undefined}
              disabled={saving || currentStep !== SCENARIO_STEPS[scenario].length - 1}
              title="Save session & get shareable link"
              style={{
                padding: '0 14px', borderRadius: 12,
                border: '1px solid rgba(59,130,246,0.35)',
                background: saving ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)',
                color: '#60a5fa',
                fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: saving || currentStep !== SCENARIO_STEPS[scenario].length - 1 ? 'not-allowed' : 'pointer', flexShrink: 0,
                opacity: currentStep === SCENARIO_STEPS[scenario].length - 1 ? 1 : 0.5,
              }}
            >
              <Save className="w-3 h-3" />
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>

        {/* Scenario gating warning */}
        {currentStep !== SCENARIO_STEPS[scenario].length - 1 && (
          <div className="mt-2 text-xs text-amber-400 font-semibold">
            Complete all scenario steps before starting, recording, or saving the session.
          </div>
        )}
      </div>

      {/* Metrics panel */}
      <div className="w-96 flex-shrink-0 border-l border-emerald-900 bg-neutral-900 overflow-y-auto">
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
