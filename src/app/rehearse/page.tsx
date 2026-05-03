'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Video, VideoOff, Activity, Play, Square, Info, ChevronRight, Layers, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
import { useMembershipDrawer } from '@/components/membership-drawer'
import { MockRuntime } from '@/components/rehearse/mock-runtime'

type Tab = 'rehearse' | 'quickstart' | 'history'

const OVERLAY_MODES = [
  { key: 'posture',    label: 'Posture',         desc: 'Body alignment & shoulder level',           locked: false },
  { key: 'gaze',       label: 'Gaze Direction',  desc: 'Eye contact with camera lens',              locked: false },
  { key: 'framing',   label: 'Framing',          desc: 'Head position & headroom detection',        locked: false },
  { key: 'pacing',    label: 'Speech Pacing',    desc: 'Talk/silence ratio via audio envelope',     locked: false },
  { key: 'anomaly',   label: 'Anomaly Detect',   desc: 'Unusual motion or environment interrupts',  locked: false },
  { key: 'nepa',      label: 'NEPA Inference',   desc: 'Full neuromorphic perception scoring',      locked: true  },
]

const QUICK_START_STEPS = [
  { n: '01', title: 'Allow camera & mic',    desc: 'Click Enable Camera and Enable Mic below. Your feed never leaves your device — all processing is on-device.' },
  { n: '02', title: 'Choose overlays',       desc: 'Toggle the analysis lanes you want. Posture, Gaze, and Framing are always free. NEPA Inference requires Pro.' },
  { n: '03', title: 'Start Rehearsal',       desc: 'Press ⌘↵ or the Start button. The Envelope score (0–100) is your real-time composite performance signal.' },
  { n: '04', title: 'Read your metrics',     desc: 'Envelope = overall. Consistency = stability over time. Each lane (Posture, Gaze, Framing, Pacing) shows 0–100.' },
  { n: '05', title: 'Anomaly Detection',     desc: 'Unlike face recognition, Anomaly only detects sudden movement or environmental changes — no identity data stored.' },
  { n: '06', title: 'Save your session',     desc: 'Save & Share arrives in V0.5. Sessions are hashed (SHA-256) and stored locally — nothing sent to any server.' },
]

export default function RehearsePage() {
  const drawer = useMembershipDrawer()
  const [tab, setTab] = useState<Tab>('quickstart')
  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [activeOverlays, setActiveOverlays] = useState<Record<string, boolean>>({
    posture: true, gaze: true, framing: true, pacing: true, anomaly: false, nepa: false,
  })
  const [showOverlayPanel, setShowOverlayPanel] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  async function toggleCamera() {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      setCameraOn(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn })
        streamRef.current = stream
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
        setCameraOn(true)
        setTab('rehearse')
      } catch { setCameraOn(false) }
    }
  }

  async function toggleMic() {
    if (!micOn && streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      if (audioTracks.length === 0) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          audioStream.getAudioTracks().forEach(t => streamRef.current!.addTrack(t))
        } catch {}
      }
      streamRef.current?.getAudioTracks().forEach(t => { t.enabled = true })
    } else if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = false })
    }
    setMicOn(m => !m)
  }

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()) }, [])

  const TABS: { key: Tab; label: string }[] = [
    { key: 'quickstart', label: 'Quick Start' },
    { key: 'rehearse',   label: 'Rehearse'    },
    { key: 'history',    label: 'History'     },
  ]

  return (
    <div className="flex h-[calc(100dvh-3rem)] overflow-hidden" style={{ background: '#070e1a', color: '#e2e8f0' }}>

      {/* Left panel — controls */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r"
        style={{ borderColor: 'rgba(16,185,129,0.1)', background: 'rgba(10,22,40,0.8)' }}>

        {/* Header */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <Activity className="w-3 h-3" style={{ color: '#10b981' }} />
            </div>
            <p className="text-sm font-bold tracking-wide" style={{ color: '#10b981' }}>Aura Rehearse</p>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Real-time perception coaching. On-device only.
          </p>
        </div>

        {/* Camera + Mic toggles — Kling style */}
        <div className="px-4 py-4 space-y-2 border-b" style={{ borderColor: 'rgba(16,185,129,0.08)' }}>
          <p className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: 'rgba(16,185,129,0.5)' }}>INPUT SOURCES</p>

          <button onClick={toggleCamera}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{
              background: cameraOn ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${cameraOn ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {cameraOn
              ? <Video className="w-4 h-4" style={{ color: '#10b981' }} />
              : <VideoOff className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />}
            <div className="flex-1 text-left">
              <p className="text-xs font-medium" style={{ color: cameraOn ? '#10b981' : 'rgba(255,255,255,0.6)' }}>
                {cameraOn ? 'Camera On' : 'Enable Camera'}
              </p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Feed stays on-device</p>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: cameraOn ? '#10b981' : 'rgba(255,255,255,0.15)' }} />
          </button>

          <button onClick={toggleMic}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{
              background: micOn ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${micOn ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {micOn
              ? <Mic className="w-4 h-4" style={{ color: '#60a5fa' }} />
              : <MicOff className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />}
            <div className="flex-1 text-left">
              <p className="text-xs font-medium" style={{ color: micOn ? '#60a5fa' : 'rgba(255,255,255,0.6)' }}>
                {micOn ? 'Mic On' : 'Enable Mic'}
              </p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Pacing analysis only</p>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: micOn ? '#60a5fa' : 'rgba(255,255,255,0.15)' }} />
          </button>
        </div>

        {/* Overlay lanes */}
        <div className="px-4 py-4 flex-1 overflow-auto">
          <button onClick={() => setShowOverlayPanel(o => !o)}
            className="flex items-center justify-between w-full mb-3">
            <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.5)' }}>ANALYSIS OVERLAYS</p>
            <ChevronRight className="w-3 h-3 transition-transform" style={{ color: 'rgba(16,185,129,0.4)', transform: showOverlayPanel ? 'rotate(90deg)' : 'none' }} />
          </button>

          <div className="space-y-1.5">
            {OVERLAY_MODES.map(mode => (
              <div key={mode.key}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${activeOverlays[mode.key] ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <button
                  onClick={() => {
                    if (mode.locked) { drawer.open(mode.label); return }
                    setActiveOverlays(prev => ({ ...prev, [mode.key]: !prev[mode.key] }))
                  }}
                  className="mt-0.5 flex-shrink-0 transition-opacity hover:opacity-80">
                  {mode.locked
                    ? <Zap className="w-3.5 h-3.5" style={{ color: 'rgba(239,68,68,0.6)' }} />
                    : activeOverlays[mode.key]
                      ? <Eye className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                      : <EyeOff className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.25)' }} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-medium" style={{ color: activeOverlays[mode.key] && !mode.locked ? '#e2e8f0' : 'rgba(255,255,255,0.4)' }}>
                      {mode.label}
                    </p>
                    {mode.locked && (
                      <span className="text-[8px] rounded px-1" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>PRO</span>
                    )}
                  </div>
                  <p className="text-[9px] leading-relaxed mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Anomaly note */}
          <div className="mt-3 px-3 py-2.5 rounded-xl flex gap-2"
            style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)' }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
            <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(96,165,250,0.7)' }}>
              <strong style={{ color: '#60a5fa' }}>No face recognition.</strong> Anomaly Detection only flags sudden movement or environmental changes — zero identity data processed.
            </p>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="px-4 pb-4">
          <button onClick={() => drawer.open('Rehearse Pro')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
            style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Zap className="w-3.5 h-3.5" /> Unlock Rehearse Pro
          </button>
          <p className="text-[9px] text-center mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>HK$108/month · POST /api/nepa/membership/trial</p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-5 py-2.5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(16,185,129,0.1)', background: 'rgba(7,14,26,0.8)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.key ? 'rgba(16,185,129,0.12)' : 'transparent',
                color: tab === t.key ? '#10b981' : 'rgba(255,255,255,0.4)',
                border: tab === t.key ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Quick Start */}
        {tab === 'quickstart' && (
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Info className="w-4 h-4" style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h1 className="text-base font-bold" style={{ color: '#e2e8f0' }}>Quick Start Guide</h1>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Get running in 60 seconds</p>
                </div>
              </div>

              <div className="space-y-3">
                {QUICK_START_STEPS.map(step => (
                  <div key={step.n} className="flex gap-4 px-4 py-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                      {step.n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#e2e8f0' }}>{step.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setTab('rehearse'); if (!cameraOn) toggleCamera() }}
                className="mt-6 w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#000', boxShadow: '0 0 24px rgba(16,185,129,0.25)' }}>
                <Play className="w-4 h-4" /> Start Rehearsal
              </button>
            </div>
          </div>
        )}

        {/* Rehearse */}
        {tab === 'rehearse' && (
          <div className="flex-1 overflow-auto p-4">
            {/* Camera viewport */}
            <div className="relative rounded-2xl overflow-hidden mb-4"
              style={{ background: '#000', border: '1px solid rgba(16,185,129,0.15)', aspectRatio: '16/9', maxHeight: '55vh' }}>
              {/* Live video */}
              <video ref={videoRef} autoPlay muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: cameraOn ? 'block' : 'none' }} />

              {/* No camera placeholder */}
              {!cameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'linear-gradient(180deg, #070e1a 0%, #0a1628 100%)' }}>
                  <div className="pointer-events-none absolute inset-0"
                    style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  <VideoOff className="w-10 h-10 mb-3" style={{ color: 'rgba(255,255,255,0.12)' }} />
                  <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(16,185,129,0.3)' }}>Camera Disabled</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>Enable camera in the left panel</p>
                  <button onClick={toggleCamera}
                    className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80 flex items-center gap-2"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Video className="w-3.5 h-3.5" /> Enable Camera
                  </button>
                </div>
              )}

              {/* Active overlay badges */}
              {cameraOn && (
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  {OVERLAY_MODES.filter(m => activeOverlays[m.key] && !m.locked).map(m => (
                    <span key={m.key} className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.6)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      {m.label}
                    </span>
                  ))}
                </div>
              )}

              {/* HUD bottom */}
              {cameraOn && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                    <span className="text-[9px] font-mono" style={{ color: '#10b981' }}>LIVE · ON DEVICE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {micOn && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono"
                        style={{ background: 'rgba(0,0,0,0.65)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                        <Mic className="w-2.5 h-2.5" /> AUDIO ON
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-lg text-[9px] font-mono"
                      style={{ background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      SHA-256 VERIFIED
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mock runtime metrics */}
            <MockRuntime />
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Activity className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <p className="text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>No sessions yet</p>
            <p className="text-xs max-w-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Save & Share arrives in V0.5. Sessions are SHA-256 hashed and stored locally — nothing leaves your device.
            </p>
            <button onClick={() => setTab('rehearse')}
              className="mt-5 px-5 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
              Start First Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
