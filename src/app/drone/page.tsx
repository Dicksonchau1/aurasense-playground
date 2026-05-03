'use client'
import React, { useState, useEffect, useRef } from 'react'
import { PlaygroundShell } from '@/components/playground-shell'
import { LaneToggle } from '@/components/lane-toggle'
import { MembershipDrawerProvider, useMembershipDrawer } from '@/components/membership-drawer'
import { ProGate } from '@/components/pro-gate'
import { NepaAgent } from '@/components/nepa-agent'
import { ExternalLink, Radio, Layers, List, RefreshCw, Maximize2, AlertTriangle, Settings, CreditCard, Key, Activity, Zap, Shield } from 'lucide-react'

const DRONES = [
  { id: 'UAV-001', name: 'Alpha Scout', status: 'live',    lat: '22.3193', lng: '114.1694', battery: 87, signal: 94, fps: 60 },
  { id: 'UAV-002', name: 'Beta Sweep',  status: 'idle',    lat: '22.3201', lng: '114.1701', battery: 62, signal: 78, fps: 0  },
  { id: 'UAV-003', name: 'Gamma Eye',   status: 'alert',   lat: '22.3185', lng: '114.1688', battery: 31, signal: 45, fps: 24 },
  { id: 'UAV-004', name: 'Delta Perch', status: 'offline', lat: '22.3210', lng: '114.1710', battery: 0,  signal: 0,  fps: 0  },
]

const STATUS_COLORS: Record<string, string> = {
  live: '#10b981', idle: '#f59e0b', alert: '#ef4444', offline: '#6b7280',
}

const OVERLAY_LANES = [
  { key: 'bbox',    label: 'Bounding Box',     locked: false },
  { key: 'depth',   label: 'Depth Map',        locked: false },
  { key: 'thermal', label: 'Thermal',          locked: false },
  { key: 'track',   label: 'Object Tracking',  locked: false },
  { key: 'nepa',    label: 'NEPA Inference',   locked: true,  note: 'PRO' },
  { key: 'change',  label: 'Change Detection', locked: true,  note: 'PRO' },
]

const NEPA_ACTIONS = [
  { label: 'Agent Status',      endpoint: '/api/nepa/status',            method: 'GET'  },
  { label: 'List Agents',       endpoint: '/api/nepa/agents',            method: 'GET'  },
  { label: 'Overlay Config',    endpoint: '/api/nepa/overlay/config',    method: 'GET'  },
  { label: 'Dispatch Mission',  endpoint: '/api/nepa/missions/dispatch', method: 'POST' },
  { label: 'Drone Registry',    endpoint: '/api/registry/drones',        method: 'GET'  },
  { label: 'Robot Registry',    endpoint: '/api/registry/robots',        method: 'GET'  },
  { label: 'Inference Stream',  endpoint: '/api/nepa/inference/stream',  method: 'WS'   },
  { label: 'Anomaly Feed',      endpoint: '/api/nepa/anomalies/live',    method: 'WS'   },
]

type Tab = 'feed' | 'registry' | 'endpoints' | 'settings' | 'billing' | 'apikeys'

// Mock overlay objects for the canvas
const MOCK_OBJECTS = [
  { x: 18, y: 22, w: 14, h: 18, label: 'Person', conf: 0.94, color: '#10b981' },
  { x: 55, y: 35, w: 10, h: 12, label: 'Vehicle', conf: 0.87, color: '#f59e0b' },
  { x: 72, y: 15, w: 8,  h: 8,  label: 'Object',  conf: 0.71, color: '#60a5fa' },
]

// Animated mock stats
function useMockStats() {
  const [stats, setStats] = useState({ fps: 60, frame: 22934, latency: 12, riskScore: 0.45 })
  useEffect(() => {
    const t = setInterval(() => {
      setStats(s => ({
        fps: 58 + Math.floor(Math.random() * 4),
        frame: s.frame + 1,
        latency: 10 + Math.floor(Math.random() * 5),
        riskScore: Math.max(0.1, Math.min(0.9, s.riskScore + (Math.random() - 0.5) * 0.05)),
      }))
    }, 250)
    return () => clearInterval(t)
  }, [])
  return stats
}

function DroneInspectContent() {
  const drawer = useMembershipDrawer()
  const [tab, setTab] = useState<Tab>('feed')
  const [selectedDrone, setSelectedDrone] = useState(DRONES[0])
  const [rtspUrl, setRtspUrl] = useState('')
  const [overlays, setOverlays] = useState<Record<string, boolean>>(
    Object.fromEntries(OVERLAY_LANES.map(l => [l.key, !l.locked]))
  )
  const [pingResult, setPingResult] = useState<Record<string, string>>({})
  const [timer, setTimer] = useState(0)
  const stats = useMockStats()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimer(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  // Draw overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (overlays.bbox) {
      MOCK_OBJECTS.forEach(obj => {
        const x = (obj.x / 100) * canvas.width
        const y = (obj.y / 100) * canvas.height
        const w = (obj.w / 100) * canvas.width
        const h = (obj.h / 100) * canvas.height
        ctx.strokeStyle = obj.color
        ctx.lineWidth = 1.5
        ctx.strokeRect(x, y, w, h)
        // Corner brackets
        const cs = 6
        ctx.beginPath()
        ctx.moveTo(x, y + cs); ctx.lineTo(x, y); ctx.lineTo(x + cs, y)
        ctx.moveTo(x + w - cs, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cs)
        ctx.moveTo(x + w, y + h - cs); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - cs, y + h)
        ctx.moveTo(x + cs, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - cs)
        ctx.stroke()
        // Label
        ctx.fillStyle = obj.color
        ctx.font = '10px monospace'
        ctx.fillText(`${obj.label} ${(obj.conf * 100).toFixed(0)}%`, x + 2, y - 3)
      })
    }

    if (overlays.track) {
      ctx.strokeStyle = 'rgba(96,165,250,0.5)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.55, canvas.height * 0.41)
      ctx.lineTo(canvas.width * 0.75, canvas.height * 0.19)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Crosshair
    const cx = canvas.width / 2, cy = canvas.height / 2
    ctx.strokeStyle = 'rgba(16,185,129,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy)
    ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(16,185,129,0.5)'
    ctx.strokeRect(cx - 6, cy - 6, 12, 12)

  }, [overlays, stats.frame])

  async function pingEndpoint(endpoint: string, method: string) {
    setPingResult(prev => ({ ...prev, [endpoint]: 'pinging…' }))
    try {
      const res = await fetch(endpoint, { method: method === 'WS' ? 'GET' : method })
      setPingResult(prev => ({ ...prev, [endpoint]: res.ok ? `${res.status} OK` : `${res.status} ERR` }))
    } catch {
      setPingResult(prev => ({ ...prev, [endpoint]: 'unreachable' }))
    }
  }

  const NAV_TABS = [
    { key: 'feed',     label: 'Feed',     icon: Radio,     pro: false },
    { key: 'registry', label: 'Registry', icon: List,      pro: false },
    { key: 'endpoints',label: 'Endpoints',icon: Layers,    pro: false },
    { key: 'settings', label: 'Settings', icon: Settings,  pro: true  },
    { key: 'billing',  label: 'Billing',  icon: CreditCard,pro: true  },
    { key: 'apikeys',  label: 'API Keys', icon: Key,       pro: true  },
  ]

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ background: '#0a1628', color: '#e2e8f0' }}>

      {/* Top bar — dashboard mockup style */}
      <div className="flex items-center gap-3 px-5 py-2.5 flex-shrink-0"
        style={{ background: 'rgba(10,22,40,0.95)', borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#10b981', fontFamily: 'monospace' }}>
            NEPA · DRONE INSPECTOR
          </span>
        </div>
        <div className="flex items-center gap-3 ml-4 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>{stats.fps} FPS</span>
          <span>●</span>
          <span style={{ color: '#10b981' }}>STREAMING</span>
          <span>●</span>
          <span>{formatTime(timer)}:{stats.frame.toString().padStart(5, '0')} F:{stats.frame}</span>
        </div>
        <div className="flex-1" />
        {/* Tab bar */}
        <div className="flex gap-0.5 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {NAV_TABS.map(({ key, label, icon: Icon, pro }) => (
            <button key={key} onClick={() => setTab(key as Tab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background: tab === key ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: tab === key ? '#10b981' : 'rgba(255,255,255,0.4)',
                border: tab === key ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
              }}>
              <Icon className="w-3 h-3" />
              {label}
              {pro && <span className="text-[8px] rounded px-1" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>PRO</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">

          {/* FEED TAB */}
          {tab === 'feed' && (
            <div className="space-y-3">
              {/* RTSP input */}
              <div className="rounded-xl p-3 flex gap-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <input type="text" value={rtspUrl} onChange={e => setRtspUrl(e.target.value)}
                  placeholder="rtsp://192.168.1.x:554/stream  or  srt://..."
                  className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none font-mono"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
                <button className="px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ background: '#10b981', color: '#000' }}>
                  <Radio className="w-3 h-3" /> Connect
                </button>
              </div>

              {/* Main viewport */}
              <div className="relative rounded-2xl overflow-hidden"
                style={{ background: '#000', border: '1px solid rgba(16,185,129,0.2)', aspectRatio: '16/9' }}>
                {/* Mock video background — gradient with scanlines */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, #0a1628 0%, #071020 40%, #0d1a2e 70%, #091525 100%)' }} />
                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)', opacity: 0.5 }} />
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                {/* Mock terrain */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 opacity-20"
                  style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.1) 50%, rgba(10,22,40,0.8) 100%)' }} />

                {/* Overlay canvas */}
                <canvas ref={canvasRef} width={960} height={540}
                  className="absolute inset-0 w-full h-full pointer-events-none" />

                {/* HUD — top left */}
                <div className="absolute top-3 left-3 space-y-1 z-10">
                  <div className="flex items-center gap-2 rounded-lg px-2.5 py-1"
                    style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                    <span className="text-[10px] font-mono" style={{ color: '#10b981' }}>{rtspUrl ? 'LIVE FEED' : 'MOCK PREVIEW'}</span>
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{stats.fps}fps</span>
                  </div>
                  <div className="rounded-lg px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {formatTime(timer)}:{stats.frame.toString().padStart(5,'0')} F:{stats.frame}
                    </span>
                  </div>
                </div>

                {/* HUD — top right: selected drone */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="rounded-lg px-2.5 py-1.5 flex items-center gap-2"
                    style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${STATUS_COLORS[selectedDrone.status]}40` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[selectedDrone.status] }} />
                    <span className="text-[10px] font-mono" style={{ color: STATUS_COLORS[selectedDrone.status] }}>{selectedDrone.name}</span>
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{selectedDrone.id}</span>
                  </div>
                </div>

                {/* HUD — bottom left: risk score */}
                <div className="absolute bottom-3 left-3 z-10">
                  <div className="rounded-lg px-2.5 py-1.5 space-y-1"
                    style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3" style={{ color: stats.riskScore > 0.6 ? '#ef4444' : '#10b981' }} />
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Risk Score</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: stats.riskScore > 0.6 ? '#ef4444' : '#10b981' }}>
                        {stats.riskScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3" style={{ color: '#60a5fa' }} />
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Latency</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: '#60a5fa' }}>{stats.latency}ms</span>
                    </div>
                  </div>
                </div>

                {/* HUD — bottom right: NERM + SHA */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                  <div className="rounded-lg px-2 py-1"
                    style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      SHA-256 VERIFIED · AUDIT CHAIN
                    </span>
                  </div>
                  <button className="p-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.4)' }}>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* No feed message */}
                {!rtspUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-5">
                    <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(16,185,129,0.3)' }}>
                      MOCK PREVIEW ACTIVE
                    </p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                      Connect RTSP/SRT feed above for live stream
                    </p>
                  </div>
                )}
              </div>

              {/* Overlay toggles — mockup style */}
              <div className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16,185,129,0.1)' }}>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.7)' }}>OVERLAY LAYERS</p>
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {Object.values(overlays).filter(Boolean).length} active
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {OVERLAY_LANES.map(lane => (
                    <LaneToggle key={lane.key} label={lane.label} note={lane.note}
                      locked={lane.locked} defaultChecked={!lane.locked} enabled={!lane.locked}
                      onChange={v => setOverlays(prev => ({ ...prev, [lane.key]: v }))} />
                  ))}
                </div>
              </div>

              {/* STDP / NERM status bar — from mockup */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'STDP Rate',  value: '0.45',   unit: '',    color: '#10b981' },
                  { label: 'Spike Δ',    value: '0.0030', unit: '',    color: '#60a5fa' },
                  { label: 'Inhibition', value: '0.70',   unit: '',    color: '#a78bfa' },
                  { label: 'Plasticity', value: '0.085',  unit: '',    color: '#f59e0b' },
                ].map(m => (
                  <div key={m.label} className="rounded-xl p-3 text-center"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[9px] font-mono uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.label}</p>
                    <p className="text-lg font-bold font-mono tabular-nums" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REGISTRY TAB */}
          {tab === 'registry' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.7)' }}>DRONE REGISTRY · JETSON NANO + SPIKE CAM</p>
                <a href="/api/registry/drones" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-mono hover:opacity-80" style={{ color: '#10b981' }}>
                  /api/registry/drones <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
                      {['ID','Name','Status','Lat','Lng','Battery','Signal','FPS'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider"
                          style={{ color: 'rgba(16,185,129,0.6)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DRONES.map((drone, i) => (
                      <tr key={drone.id} onClick={() => setSelectedDrone(drone)}
                        className="cursor-pointer transition-colors"
                        style={{
                          background: selectedDrone.id === drone.id ? 'rgba(16,185,129,0.06)' : i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          borderLeft: selectedDrone.id === drone.id ? '2px solid #10b981' : '2px solid transparent',
                        }}>
                        <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{drone.id}</td>
                        <td className="px-4 py-2.5 font-medium text-xs" style={{ color: '#e2e8f0' }}>{drone.name}</td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1.5 text-[10px] font-mono capitalize" style={{ color: STATUS_COLORS[drone.status] }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[drone.status] }} />{drone.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{drone.lat}</td>
                        <td className="px-4 py-2.5 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{drone.lng}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-14 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                              <div className="h-full rounded-full" style={{ width: `${drone.battery}%`, background: drone.battery > 50 ? '#10b981' : drone.battery > 20 ? '#f59e0b' : '#ef4444' }} />
                            </div>
                            <span className="text-[10px] font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.4)' }}>{drone.battery}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[10px] font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.4)' }}>{drone.signal}%</td>
                        <td className="px-4 py-2.5 text-[10px] font-mono" style={{ color: drone.fps > 0 ? '#10b981' : 'rgba(255,255,255,0.2)' }}>{drone.fps > 0 ? `${drone.fps} FPS` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <a href="/api/registry/drones" target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-[10px] font-mono border hover:opacity-80 transition-opacity"
                  style={{ borderColor: '#10b981', color: '#10b981' }}>GET /api/registry/drones</a>
                <a href="/api/registry/robots" target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-[10px] font-mono border hover:opacity-80 transition-opacity"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>GET /api/registry/robots</a>
              </div>
            </div>
          )}

          {/* ENDPOINTS TAB */}
          {tab === 'endpoints' && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'rgba(16,185,129,0.7)' }}>NEPA ENDPOINT EXPLORER</p>
              {NEPA_ACTIONS.map(action => (
                <div key={action.endpoint} className="rounded-xl border p-3.5 flex items-center gap-4"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                    style={{ background: action.method === 'GET' ? 'rgba(16,185,129,0.12)' : action.method === 'POST' ? 'rgba(59,130,246,0.12)' : 'rgba(168,85,247,0.12)', color: action.method === 'GET' ? '#10b981' : action.method === 'POST' ? '#60a5fa' : '#c084fc' }}>
                    {action.method}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: '#e2e8f0' }}>{action.label}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{action.endpoint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pingResult[action.endpoint] && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                        style={{ background: pingResult[action.endpoint].includes('OK') ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: pingResult[action.endpoint].includes('OK') ? '#10b981' : '#ef4444' }}>
                        {pingResult[action.endpoint]}
                      </span>
                    )}
                    <button onClick={() => pingEndpoint(action.endpoint, action.method)}
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <a href={action.endpoint} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB — PRO GATED */}
          {tab === 'settings' && (
            <ProGate feature="Settings">
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.7)' }}>PROJECT SETTINGS</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Settings panel content here.</p>
              </div>
            </ProGate>
          )}

          {/* BILLING TAB — PRO GATED */}
          {tab === 'billing' && (
            <ProGate feature="Billing">
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.7)' }}>BILLING — MARCH 2026</p>
                {[
                  { label: 'Compute Hours', used: 342, total: 500, unit: 'hrs' },
                  { label: 'API Calls',      used: 22500, total: 50000, unit: '' },
                  { label: 'Edge Storage',   used: 16.2, total: 50, unit: 'GB' },
                  { label: 'RunPod Credits', used: 162, total: 200, unit: '$' },
                ].map(item => (
                  <div key={item.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                      <span className="text-xs font-mono tabular-nums" style={{ color: '#e2e8f0' }}>{item.unit}{item.used} / {item.unit}{item.total} {item.unit === 'hrs' ? 'hrs' : item.unit === 'GB' ? 'GB' : item.unit === '$' ? '' : ''}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(item.used / item.total) * 100}%`, background: (item.used / item.total) > 0.8 ? '#ef4444' : '#10b981' }} />
                    </div>
                  </div>
                ))}
              </div>
            </ProGate>
          )}

          {/* API KEYS TAB — PRO GATED */}
          {tab === 'apikeys' && (
            <ProGate feature="API Keys">
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.7)' }}>API KEYS</p>
                {[
                  { label: 'Primary',  value: 'sk-nepa-••••••••4f2a', endpoint: '/api/nepa/keys/primary' },
                  { label: 'Webhook', value: '/api/v2/hook/nepa',     endpoint: '/api/nepa/keys/webhook' },
                ].map(k => (
                  <div key={k.label} className="rounded-xl p-4 flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{k.label}</p>
                      <p className="text-xs font-mono" style={{ color: '#10b981' }}>{k.value}</p>
                    </div>
                    <a href={k.endpoint} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </ProGate>
          )}
        </div>

        {/* Right panel — selected drone + quick actions */}
        <div className="w-64 flex-shrink-0 overflow-auto p-4 space-y-4"
          style={{ borderLeft: '1px solid rgba(16,185,129,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.6)' }}>ACTIVE UNIT</p>

          <div className="rounded-xl p-3.5 space-y-2.5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🚁</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{selectedDrone.name}</p>
                <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{selectedDrone.id}</p>
              </div>
            </div>
            {[
              { label: 'Status',    value: selectedDrone.status,        color: STATUS_COLORS[selectedDrone.status] },
              { label: 'Lat',       value: selectedDrone.lat,           color: 'rgba(255,255,255,0.6)' },
              { label: 'Lng',       value: selectedDrone.lng,           color: 'rgba(255,255,255,0.6)' },
              { label: 'Battery',   value: `${selectedDrone.battery}%`, color: selectedDrone.battery > 50 ? '#10b981' : selectedDrone.battery > 20 ? '#f59e0b' : '#ef4444' },
              { label: 'Signal',    value: `${selectedDrone.signal}%`,  color: 'rgba(255,255,255,0.6)' },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-[10px] font-mono">
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{row.label}</span>
                <span className="capitalize" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          {selectedDrone.status === 'alert' && (
            <div className="rounded-xl p-3 flex gap-2" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: '#ef4444' }}>ALERT ACTIVE</p>
                <a href="/api/nepa/anomalies/live" target="_blank" rel="noopener noreferrer"
                  className="text-[9px] font-mono hover:opacity-80 flex items-center gap-1" style={{ color: '#ef4444' }}>
                  /api/nepa/anomalies/live <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.6)' }}>QUICK ACTIONS</p>
            {[
              { label: 'Get Status',       endpoint: '/api/nepa/status' },
              { label: 'Dispatch Mission', endpoint: '/api/nepa/missions/dispatch' },
              { label: 'Inference Stream', endpoint: '/api/nepa/inference/stream' },
            ].map(a => (
              <a key={a.endpoint} href={a.endpoint} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0' }}>
                <span className="text-[10px]">{a.label}</span>
                <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{a.endpoint}</span>
              </a>
            ))}
          </div>

          <button onClick={() => drawer.open('NEPA Inference')}
            className="w-full py-2 rounded-lg text-[10px] font-semibold font-mono uppercase tracking-wider border transition-opacity hover:opacity-80"
            style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#10b981', background: 'rgba(16,185,129,0.05)' }}>
            UNLOCK PRO OVERLAYS
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DronePage() {
  return (
    <MembershipDrawerProvider>
      <PlaygroundShell>
        <DroneInspectContent />
      </PlaygroundShell>
      <NepaAgent />
    </MembershipDrawerProvider>
  )
}
