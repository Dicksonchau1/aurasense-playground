'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, X, Send, Activity } from 'lucide-react'
import { useMembershipDrawer } from '@/components/membership-drawer'

interface Message { id: string; role: 'agent' | 'user'; text: string; endpoint?: string; frame?: string; ts: string }

const QUICK = [
  { label: 'Status',    q: 'status'    },
  { label: 'Missions',  q: 'missions'  },
  { label: 'Anomalies', q: 'anomalies' },
  { label: 'NERM',      q: 'nerm'      },
]

function agentReply(input: string, frame?: string): Message {
  const lower = input.toLowerCase()
  let text = 'Routing to NEPA runtime…'
  let endpoint = '/api/nepa/status'
  if (frame)                              { text = `Analysing frame region: ${frame}. Running NEPA inference…` }
  else if (lower.includes('drone') || lower.includes('uav'))  { text = '4 units indexed. UAV-003 on alert — low battery.'; endpoint = '/api/registry/drones' }
  else if (lower.includes('mission'))    { text = '2 missions in-flight, 1 queued.';                              endpoint = '/api/nepa/missions/active' }
  else if (lower.includes('anomal'))     { text = 'Anomaly feed live. Last: UAV-003 battery critical.';           endpoint = '/api/nepa/anomalies/live' }
  else if (lower.includes('nerm'))       { text = 'NERM mode: STANDBY. Ultra-low latency codec ready.';           endpoint = '/api/nepa/nerm/status' }
  else if (lower.includes('overlay'))   { text = 'BBox + Depth active. NEPA Inference locked (PRO).';            endpoint = '/api/nepa/overlay/config' }
  else if (lower.includes('status'))    { text = 'All subsystems nominal. Runtime: healthy.';                    endpoint = '/api/nepa/status' }
  return { id: Date.now().toString(), role: 'agent', text, endpoint, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
}

let _frameCaptureCallback: ((region: string) => void) | null = null
export function registerFrameCapture(cb: (region: string) => void) { _frameCaptureCallback = cb }
export function captureFrameRegion(region: string) { _frameCaptureCallback?.(region) }

export function NavBar() {
  const pathname = usePathname()
  const drawer = useMembershipDrawer()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'agent', text: 'NEPA runtime online. Click any frame region or ask me anything.', endpoint: '/api/nepa/status', ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [pulse, setPulse] = useState(false)
  const [pendingFrame, setPendingFrame] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1800); return () => clearInterval(t) }, [])
  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  useEffect(() => {
    registerFrameCapture((region) => {
      setPendingFrame(region)
      setOpen(true)
      const userMsg: Message = { id: Date.now().toString(), role: 'user', text: `Analyse frame region: ${region}`, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => [...prev, userMsg])
      setTimeout(() => setMessages(prev => [...prev, agentReply('', region)]), 700)
    })
  }, [])

  function send(text?: string) {
    const msg = (text || input).trim()
    if (!msg) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg, ts: new Date().toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setPendingFrame(null)
    setTimeout(() => setMessages(prev => [...prev, agentReply(msg)]), 600)
  }

  const NAV = [
    { href: '/',          label: 'Home'     },
    { href: '/drone',     label: 'Drone'    },
    { href: '/rehearse',  label: 'Rehearse' },
    { href: '/facility',  label: 'Facility', soon: true },
    { href: '/portal',    label: 'Portal',   soon: true },
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
                {label}
                <span className="text-[8px] rounded px-1" style={{ background: 'rgba(255,255,255,0.08)' }}>SOON</span>
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

        {/* 3D orb */}
        <button onClick={() => setOpen(o => !o)} aria-label="Open NEPA Agent"
          className="relative w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(16,185,129,0.6) 0%, rgba(7,14,26,0.9) 60%, rgba(16,185,129,0.15) 100%)',
            boxShadow: pulse ? '0 0 0 3px rgba(16,185,129,0.25), 0 0 20px rgba(16,185,129,0.4)' : '0 0 0 2px rgba(16,185,129,0.15), 0 0 10px rgba(16,185,129,0.2)',
            border: '1px solid rgba(16,185,129,0.4)',
            transition: 'box-shadow 0.8s ease',
          }}>
          <div className="absolute top-1.5 left-2 w-2 h-1 rounded-full pointer-events-none"
            style={{ background: 'rgba(255,255,255,0.35)', filter: 'blur(1px)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-4 h-4" style={{ color: '#10b981' }} />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
            style={{ background: '#10b981', borderColor: '#070e1a' }} />
        </button>
      </nav>

      {open && (
        <div className="fixed top-14 right-4 z-50 w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: '#0a1628', border: '1px solid rgba(16,185,129,0.25)', maxHeight: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(16,185,129,0.12)', background: 'rgba(16,185,129,0.04)' }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Activity className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: '#10b981' }}>NEPA Agent</p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Click any frame region to analyse</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
              <span className="text-[9px] font-mono" style={{ color: '#10b981' }}>LIVE</span>
            </div>
            <button onClick={() => setOpen(false)} className="ml-1 hover:opacity-60" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {QUICK.map(a => (
              <button key={a.q} onClick={() => send(a.label)}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-medium transition-opacity hover:opacity-80"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.18)' }}>
                {a.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'agent' && (
                  <div className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Zap className="w-2.5 h-2.5" style={{ color: '#10b981' }} />
                  </div>
                )}
                <div className="max-w-[210px]">
                  <div className="rounded-xl px-3 py-2 text-xs leading-relaxed"
                    style={msg.role === 'agent'
                      ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.06)' }
                      : { background: 'rgba(16,185,129,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    {msg.frame && <span className="block text-[9px] mb-1" style={{ color: 'rgba(16,185,129,0.6)' }}>📍 {msg.frame}</span>}
                    {msg.text}
                  </div>
                  {msg.endpoint && (
                    <a href={msg.endpoint} target="_blank" rel="noopener noreferrer"
                      className="block text-[9px] mt-0.5 font-mono hover:opacity-80"
                      style={{ color: 'rgba(16,185,129,0.5)' }}>
                      → {msg.endpoint}
                    </a>
                  )}
                  <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.18)' }}>{msg.ts}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {pendingFrame && (
              <div className="mb-2 px-2 py-1 rounded-lg text-[9px] font-mono flex items-center gap-1.5"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.15)' }}>
                <span>📍</span> {pendingFrame}
                <button onClick={() => setPendingFrame(null)} className="ml-auto opacity-50 hover:opacity-100"><X className="w-2.5 h-2.5" /></button>
              </div>
            )}
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask NEPA or click a frame…"
                className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }} />
              <button onClick={() => send()}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80"
                style={{ background: '#10b981', color: '#000' }}>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
