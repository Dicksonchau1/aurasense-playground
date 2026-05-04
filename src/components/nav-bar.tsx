'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, X, Send, Activity, Upload, Play, ChevronRight, Cpu, Eye, Brain, Layers, Network, GitBranch, CircuitBoard, Workflow, ShieldCheck, MessageSquare, Globe2, Volume2, VolumeX } from 'lucide-react'
import { useMembershipDrawer } from '@/components/membership-drawer'

interface Message { id: string; role: 'agent' | 'user'; text: string; endpoint?: string; frame?: string; attachment?: string; ts: string }

const QUICK = [
  { label: 'World Model',   q: 'world model' },
  { label: 'STDP Network',  q: 'stdp'        },
  { label: 'Run Inference', q: 'inference'   },
  { label: 'Agentic Flow',  q: 'agentic'     },
]

const INFERENCE_ENDPOINTS = [
  { label: 'Visual Inference',    endpoint: '/api/nepa/inference/visual',    method: 'POST' },
  { label: 'Spatiotemporal STDP', endpoint: '/api/nepa/inference/stdp',      method: 'POST' },
  { label: 'World Model Predict', endpoint: '/api/nepa/world-model/predict', method: 'POST' },
]

const AGENTIC_STAGES = [
  { n: 1,  label: 'Sensor Ingestion',        icon: Eye,          desc: 'Multi-modal input: RGB, depth, audio, IMU streams arrive via WebRTC/RTSP.' },
  { n: 2,  label: 'Spike Encoding',          icon: Zap,          desc: 'Raw signals converted to sparse spike trains via temporal contrast coding.' },
  { n: 3,  label: 'STDP Learning',           icon: Brain,        desc: 'Spike-Timing Dependent Plasticity adapts synaptic weights online — no backprop.' },
  { n: 4,  label: 'World Model Prior',       icon: Network,      desc: 'Latent dynamics model predicts next-frame state across spatial + temporal axes.' },
  { n: 5,  label: 'Perception Fusion',       icon: Layers,       desc: 'STDP outputs fused with world model priors into a unified perception graph.' },
  { n: 6,  label: 'Anomaly Detection',       icon: CircuitBoard, desc: 'Prediction error spikes trigger anomaly flags — no face recognition.' },
  { n: 7,  label: 'Agent Reasoning',         icon: Cpu,          desc: 'VODA/CODA agents plan responses using perception graph + mission context.' },
  { n: 8,  label: 'Action Orchestration',    icon: Workflow,     desc: 'NEPA dispatches commands to drones, robots, or downstream services.' },
  { n: 9,  label: 'Audit & SHA-256 Chain',   icon: ShieldCheck,  desc: 'Every decision hashed into immutable audit log for compliance + replay.' },
  { n: 10, label: 'Continual Learning Loop', icon: GitBranch,    desc: 'Outcomes feed back as STDP reinforcement — closing the hybrid learning loop.' },
]

function agentReply(input: string, frame?: string, attachment?: string): Message {
  const lower = input.toLowerCase()
  let text = 'Routing to NEPA runtime…'
  let endpoint = '/api/nepa/status'
  if (attachment)                                                  { text = `Received ${attachment}. Dispatching to /api/nepa/inference/visual + /api/nepa/inference/stdp + /api/nepa/world-model/predict in parallel. ETA ~3s.`; endpoint = '/api/nepa/inference/visual' }
  else if (frame)                                                  { text = `Frame region ${frame} captured. STDP encoder + world model prior running.`;          endpoint = '/api/nepa/inference/stdp' }
  else if (lower.includes('world model'))                          { text = 'World model is the latent dynamics prior. STDP supplies sparse spikes, world model predicts the next state — together they form the hybrid loop.'; endpoint = '/api/nepa/world-model/predict' }
  else if (lower.includes('stdp'))                                 { text = 'STDP = Spike-Timing Dependent Plasticity. Online weight updates from spike order. No backprop, no labels — biological computing.'; endpoint = '/api/nepa/inference/stdp' }
  else if (lower.includes('inference'))                            { text = 'Three inference paths active: Visual, STDP, World Model. Upload an MP4 below to run all three.'; endpoint = '/api/nepa/inference/visual' }
  else if (lower.includes('agentic') || lower.includes('flow'))    { text = '10-stage NEPA pipeline. Open the Flow tab to expand each stage.'; endpoint = '/api/nepa/pipeline/status' }
  else if (lower.includes('drone') || lower.includes('uav'))       { text = '4 units indexed. UAV-003 on alert.'; endpoint = '/api/registry/drones' }
  else if (lower.includes('mission'))                              { text = '2 missions in-flight, 1 queued.'; endpoint = '/api/nepa/missions/active' }
  else if (lower.includes('anomal'))                               { text = 'Anomaly = world model prediction error spike. Movement-based, no identity.'; endpoint = '/api/nepa/anomalies/live' }
  return { id: Date.now().toString(), role: 'agent', text, endpoint, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
}

let _frameCaptureCallback: ((region: string) => void) | null = null
export function registerFrameCapture(cb: (region: string) => void) { _frameCaptureCallback = cb }
export function captureFrameRegion(region: string) { _frameCaptureCallback?.(region) }

export function NavBar() {
  const pathname = usePathname()
  const drawer = useMembershipDrawer()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'chat' | 'world' | 'flow'>('chat')
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'agent', text: 'NEPA runtime online. World Model + STDP active. Upload an MP4 or click any frame to begin.', endpoint: '/api/nepa/status', ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [pulse, setPulse] = useState(false)
  const [pendingFrame, setPendingFrame] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [expandedStage, setExpandedStage] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const heroVidRef = useRef<HTMLVideoElement>(null)

  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1800); return () => clearInterval(t) }, [])
  useEffect(() => { if (open && view === 'chat') bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open, view])

  useEffect(() => {
    registerFrameCapture((region) => {
      setPendingFrame(region); setOpen(true); setView('chat')
      const userMsg: Message = { id: Date.now().toString(), role: 'user', text: `Analyse frame: ${region}`, frame: region, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => [...prev, userMsg])
      setTimeout(() => setMessages(prev => [...prev, agentReply('', region)]), 700)
    })
  }, [])

  function send(text?: string) {
    const msg = (text || input).trim()
    if (!msg) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg]); setInput(''); setPendingFrame(null)
    setTimeout(() => setMessages(prev => [...prev, agentReply(msg)]), 600)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setView('chat')
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: `Uploaded ${file.name}`, attachment: file.name, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    INFERENCE_ENDPOINTS.forEach(ep => {
      const fd = new FormData(); fd.append('video', file)
      fetch(ep.endpoint, { method: 'POST', body: fd }).catch(() => {})
    })
    setTimeout(() => {
      setMessages(prev => [...prev, agentReply('', undefined, file.name)])
      setUploading(false)
    }, 800)
    if (fileRef.current) fileRef.current.value = ''
  }

  const NAV = [
    { href: '/',         label: 'Home'     },
    { href: '/drone',    label: 'Drone'    },
    { href: '/rehearse', label: 'Rehearse' },
    { href: '/facility', label: 'Facility', soon: true },
    { href: '/portal',   label: 'Portal',   soon: true },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center px-4 h-12"
        style={{ background: 'rgba(7,14,26,0.96)', borderBottom: '1px solid rgba(16,185,129,0.12)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <Zap className="w-3 h-3" style={{ color: '#10b981' }} />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#10b981' }}>AuraSense</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV.map(({ href, label, soon }) => {
            const active = pathname === href
            if (soon) return (
              <span key={href} className="px-3 py-1 rounded-lg text-xs opacity-30 cursor-default flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {label}<span className="text-[8px] rounded px-1" style={{ background: 'rgba(255,255,255,0.08)' }}>SOON</span>
              </span>
            )
            return (
              <Link key={href} href={href}
                className="px-3 py-1 rounded-lg text-xs transition-all"
                style={{ background: active ? 'rgba(16,185,129,0.12)' : 'transparent', color: active ? '#10b981' : 'rgba(255,255,255,0.45)', border: active ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent' }}>
                {label}
              </Link>
            )
          })}
        </div>

        <div className="flex-1" />

        <button onClick={() => drawer.open('NEPA Pro')}
          className="mr-4 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-80"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
          Upgrade Pro
        </button>

        <button onClick={() => setOpen(o => !o)} aria-label="Open NEPA Agent"
          className="relative w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(16,185,129,0.6) 0%, rgba(7,14,26,0.9) 60%, rgba(16,185,129,0.15) 100%)',
            boxShadow: pulse ? '0 0 0 3px rgba(16,185,129,0.25), 0 0 20px rgba(16,185,129,0.4)' : '0 0 0 2px rgba(16,185,129,0.15), 0 0 10px rgba(16,185,129,0.2)',
            border: '1px solid rgba(16,185,129,0.4)', transition: 'box-shadow 0.8s ease',
          }}>
          <div className="absolute top-1.5 left-2 w-2 h-1 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.35)', filter: 'blur(1px)' }} />
          <div className="absolute inset-0 flex items-center justify-center"><Activity className="w-4 h-4" style={{ color: '#10b981' }} /></div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse" style={{ background: '#10b981', borderColor: '#070e1a' }} />
        </button>
      </nav>

      {open && (
        <div className="fixed top-14 right-4 z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: '#0a1628', border: '1px solid rgba(16,185,129,0.25)', width: '420px', maxHeight: 'calc(100dvh - 5rem)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(16,185,129,0.12)', background: 'rgba(16,185,129,0.04)' }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Activity className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: '#10b981' }}>NEPA Agent</p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>World Model · STDP · 10-Stage Flow</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
              <span className="text-[9px] font-mono" style={{ color: '#10b981' }}>LIVE</span>
            </div>
            <button onClick={() => setOpen(false)} className="ml-1 hover:opacity-60" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* View tabs */}                                                              <div className="flex gap-1 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {[
              { k: 'chat',  l: 'Chat',        i: MessageSquare },
              { k: 'world', l: 'World Model', i: Globe2        },
              { k: 'flow',  l: '10-Stage',    i: Workflow      },
            ].map(t => {
              const Icon = t.i as any
              const active = view === t.k
              return (
                <button key={t.k} onClick={() => setView(t.k as any)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-medium transition-all"
                  style={{
                    background: active ? 'rgba(16,185,129,0.12)' : 'transparent',
                    color: active ? '#10b981' : 'rgba(255,255,255,0.4)',
                    border: active ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
                  }}>
                  <Icon className="w-3 h-3" />
                  {t.l}
                </button>
              )
            })}
          </div>

          {/* CHAT VIEW */}
          {view === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ minHeight: '280px', maxHeight: '420px' }}>
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%]">
                      <div className="px-3 py-2 rounded-xl text-xs leading-relaxed"
                        style={{
                          background: m.role === 'user' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                          border: m.role === 'user' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.06)',
                          color: m.role === 'user' ? '#10b981' : 'rgba(255,255,255,0.85)',
                        }}>
                        {m.frame && (
                          <div className="mb-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded inline-block" style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
                            FRAME · {m.frame}
                          </div>
                        )}
                        {m.attachment && (
                          <div className="mb-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1" style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
                            <Upload className="w-2.5 h-2.5" /> {m.attachment}
                          </div>
                        )}
                        <p>{m.text}</p>
                        {m.endpoint && (
                          <p className="mt-1.5 text-[9px] font-mono opacity-60">→ {m.endpoint}</p>
                        )}
                      </div>
                      <p className="text-[8px] mt-1 px-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{m.ts}</p>
                    </div>
                  </div>
                ))}
                {uploading && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-xl text-xs flex items-center gap-2"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)' }}>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                      Dispatching to inference endpoints…
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick chips */}
              <div className="px-3 py-2 flex gap-1.5 flex-wrap flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {QUICK.map(q => (
                  <button key={q.q} onClick={() => send(q.q)}
                    className="px-2 py-1 rounded-md text-[9px] font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.18)' }}>
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Input + upload */}
              <div className="px-3 py-3 flex items-center gap-2 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
                <input ref={fileRef} type="file" accept="video/mp4,video/*" onChange={handleUpload} className="hidden" />
                <button onClick={() => fileRef.current?.click()} aria-label="Upload video"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <input type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={pendingFrame ? `Frame ${pendingFrame} ready…` : 'Ask NEPA…'}
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
                <button onClick={() => send()} aria-label="Send"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
                  style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* WORLD MODEL VIEW */}
          {view === 'world' && (
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '480px' }}>
              <div className="relative" style={{ background: '#000' }}>
                <video
                  ref={heroVidRef}
                  src="/hero/world-model-stdp.mp4"
                  poster=""
                  autoPlay loop playsInline
                  muted={muted}
                  onError={(e) => {
                    const v = e.currentTarget
                    if (!v.src.endsWith('/hero/scene-builder.mp4')) v.src = '/hero/scene-builder.mp4'
                  }}
                  className="w-full h-auto block"
                  style={{ maxHeight: '240px', objectFit: 'cover' }}
                />
                <button onClick={() => setMuted(m => !m)}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono"
                  style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                  WORLD MODEL · STDP
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>Hybrid Latent Dynamics</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    The world model learns a latent prior over scene dynamics. STDP layers supply sparse, event-driven spikes that update the prior online — no labels, no backprop. Prediction error becomes the anomaly signal.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 'Latency',   v: '8.2ms'  },
                    { k: 'Sparsity',  v: '94%'    },
                    { k: 'Energy',    v: '0.3W'   },
                  ].map(s => (
                    <div key={s.k} className="px-2 py-1.5 rounded-lg text-center"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <p className="text-[8px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.k}</p>
                      <p className="text-xs font-mono font-bold" style={{ color: '#10b981' }}>{s.v}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {INFERENCE_ENDPOINTS.map(ep => (
                    <div key={ep.endpoint} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Play className="w-3 h-3 flex-shrink-0" style={{ color: '#10b981' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{ep.label}</p>
                        <p className="text-[9px] font-mono opacity-50" style={{ color: 'rgba(255,255,255,0.5)' }}>{ep.method} {ep.endpoint}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => fileRef.current?.click()}
                  className="w-full py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  <Upload className="w-3.5 h-3.5" /> Upload MP4 to All 3 Endpoints
                </button>
              </div>
            </div>
          )}

          {/* 10-STAGE FLOW VIEW */}
          {view === 'flow' && (
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5" style={{ maxHeight: '480px' }}>
              {AGENTIC_STAGES.map(stage => {
                const Icon = stage.icon as any
                const expanded = expandedStage === stage.n
                return (
                  <button key={stage.n}
                    onClick={() => setExpandedStage(expanded ? null : stage.n)}
                    className="w-full text-left rounded-lg p-2.5 transition-all"
                    style={{
                      background: expanded ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                      border: expanded ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono opacity-50" style={{ color: '#10b981' }}>STAGE {stage.n.toString().padStart(2, '0')}</p>
                        <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{stage.label}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                        style={{ color: 'rgba(255,255,255,0.4)', transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }} />
                    </div>
                    {expanded && (
                      <p className="mt-2 text-[10px] leading-relaxed pl-9" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {stage.desc}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
