'use client'
import React, { useState } from 'react'
import { PlaygroundShell } from '@/components/playground-shell'
import { LaneToggle } from '@/components/lane-toggle'
import { MembershipDrawerProvider, useMembershipDrawer } from '@/components/membership-drawer'
import { ExternalLink, Radio, Layers, List, RefreshCw, Maximize2, AlertTriangle } from 'lucide-react'

const DRONES = [
  { id: 'UAV-001', name: 'Alpha Scout', status: 'live',    lat: '22.3193', lng: '114.1694', battery: 87, signal: 94 },
  { id: 'UAV-002', name: 'Beta Sweep',  status: 'idle',    lat: '22.3201', lng: '114.1701', battery: 62, signal: 78 },
  { id: 'UAV-003', name: 'Gamma Eye',   status: 'alert',   lat: '22.3185', lng: '114.1688', battery: 31, signal: 45 },
  { id: 'UAV-004', name: 'Delta Perch', status: 'offline', lat: '22.3210', lng: '114.1710', battery: 0,  signal: 0  },
]

const STATUS_COLORS: Record<string, string> = {
  live: 'var(--accent-green)', idle: 'var(--accent-amber, #f59e0b)',
  alert: 'var(--lock-red)', offline: 'var(--muted)',
}

const OVERLAY_LANES = [
  { key: 'bbox',    label: 'Bounding Box',     locked: false, note: undefined },
  { key: 'depth',   label: 'Depth Map',        locked: false, note: undefined },
  { key: 'thermal', label: 'Thermal',          locked: false, note: undefined },
  { key: 'track',   label: 'Object Tracking',  locked: false, note: undefined },
  { key: 'nepa',    label: 'NEPA Inference',   locked: true,  note: 'PRO'     },
  { key: 'change',  label: 'Change Detection', locked: true,  note: 'PRO'     },
]

const NEPA_ACTIONS = [
  { label: 'Agent Status',      endpoint: '/api/nepa/status',             method: 'GET'  },
  { label: 'List Agents',       endpoint: '/api/nepa/agents',             method: 'GET'  },
  { label: 'Overlay Config',    endpoint: '/api/nepa/overlay/config',     method: 'GET'  },
  { label: 'Dispatch Mission',  endpoint: '/api/nepa/missions/dispatch',  method: 'POST' },
  { label: 'Drone Registry',    endpoint: '/api/registry/drones',         method: 'GET'  },
  { label: 'Robot Registry',    endpoint: '/api/registry/robots',         method: 'GET'  },
  { label: 'Inference Stream',  endpoint: '/api/nepa/inference/stream',   method: 'WS'   },
  { label: 'Anomaly Feed',      endpoint: '/api/nepa/anomalies/live',     method: 'WS'   },
]

type Tab = 'feed' | 'registry' | 'endpoints'

function DroneInspectContent() {
  const drawer = useMembershipDrawer()
  const [tab, setTab] = useState<Tab>('feed')
  const [selectedDrone, setSelectedDrone] = useState(DRONES[0])
  const [rtspUrl, setRtspUrl] = useState('')
  const [pingResult, setPingResult] = useState<Record<string, string>>({})

  async function pingEndpoint(endpoint: string, method: string) {
    setPingResult(prev => ({ ...prev, [endpoint]: 'pinging…' }))
    try {
      const res = await fetch(endpoint, { method: method === 'WS' ? 'GET' : method })
      setPingResult(prev => ({ ...prev, [endpoint]: res.ok ? `${res.status} OK` : `${res.status} ERR` }))
    } catch {
      setPingResult(prev => ({ ...prev, [endpoint]: 'unreachable' }))
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b px-5 py-3 flex-shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-green)' }}>
            NEPA · Drone Inspector
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'var(--bg)' }}>
          {(['feed', 'registry', 'endpoints'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors"
              style={{ background: tab === t ? 'var(--panel)' : 'transparent', color: tab === t ? 'var(--text)' : 'var(--muted)' }}>
              {t === 'feed' && <Radio className="w-3 h-3" />}
              {t === 'registry' && <List className="w-3 h-3" />}
              {t === 'endpoints' && <Layers className="w-3 h-3" />}
              {t}
            </button>
          ))}
        </div>
        <a href="https://docs.aurasensehk.com/nepa/drone" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs hover:opacity-80" style={{ color: 'var(--muted)' }}>
          Docs <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-5">

          {tab === 'feed' && (
            <div className="space-y-4">
              <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Live Feed Source</p>
                <div className="flex gap-2">
                  <input type="text" value={rtspUrl} onChange={e => setRtspUrl(e.target.value)}
                    placeholder="rtsp://192.168.1.x:554/stream  or  srt://..."
                    className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                  <button className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90 flex items-center gap-1"
                    style={{ background: 'var(--accent-green)', color: '#000' }}>
                    <Radio className="w-3 h-3" /> Connect
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border"
                style={{ borderColor: 'var(--border)', background: '#000' }}>
                <div className="absolute top-3 right-3 z-10">
                  <span className="rounded-full px-2 py-0.5 text-xs flex items-center gap-1"
                    style={{ background: 'rgba(0,0,0,0.6)', color: STATUS_COLORS[selectedDrone.status], border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[selectedDrone.status] }} />
                    {selectedDrone.name}
                  </span>
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {rtspUrl ? 'Connecting to stream…' : 'No feed connected'}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.12)' }}>Paste an RTSP or SRT URL above</p>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)' }} />
                <button className="absolute bottom-3 right-3 z-10 p-1.5 rounded-lg"
                  style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.5)' }}>
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>Overlay Layers</p>
                <div className="flex flex-wrap gap-2">
                  {OVERLAY_LANES.map(lane => (
                    <LaneToggle key={lane.key} label={lane.label} note={lane.note} locked={lane.locked} defaultChecked={!lane.locked} enabled={!lane.locked} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'registry' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Drone Registry</p>
                <a href="/api/registry/drones" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs hover:opacity-80" style={{ color: 'var(--accent-green)' }}>
                  /api/registry/drones <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                      {['ID','Name','Status','Lat','Lng','Battery','Signal'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DRONES.map((drone, i) => (
                      <tr key={drone.id} onClick={() => setSelectedDrone(drone)} className="cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ background: selectedDrone.id === drone.id ? 'rgba(16,185,129,0.06)' : i % 2 === 0 ? 'var(--bg)' : 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted)' }}>{drone.id}</td>
                        <td className="px-4 py-3 font-medium text-xs" style={{ color: 'var(--text)' }}>{drone.name}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-xs capitalize" style={{ color: STATUS_COLORS[drone.status] }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[drone.status] }} />{drone.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted)' }}>{drone.lat}</td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted)' }}>{drone.lng}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                              <div className="h-full rounded-full" style={{ width: `${drone.battery}%`, background: drone.battery > 50 ? 'var(--accent-green)' : drone.battery > 20 ? '#f59e0b' : 'var(--lock-red)' }} />
                            </div>
                            <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>{drone.battery}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--muted)' }}>{drone.signal}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <a href="/api/registry/drones" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-medium border hover:opacity-80 transition-opacity"
                  style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>
                  GET /api/registry/drones
                </a>
                <a href="/api/registry/robots" target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-medium border hover:opacity-80 transition-opacity"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  GET /api/registry/robots
                </a>
              </div>
            </div>
          )}

          {tab === 'endpoints' && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>NEPA Endpoint Explorer</p>
              {NEPA_ACTIONS.map(action => (
                <div key={action.endpoint} className="rounded-xl border p-4 flex items-center gap-4"
                  style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                    style={{ background: action.method === 'GET' ? 'rgba(16,185,129,0.12)' : action.method === 'POST' ? 'rgba(59,130,246,0.12)' : 'rgba(168,85,247,0.12)', color: action.method === 'GET' ? 'var(--accent-green)' : action.method === 'POST' ? '#60a5fa' : '#c084fc' }}>
                    {action.method}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{action.label}</p>
                    <p className="text-xs font-mono truncate" style={{ color: 'var(--muted)' }}>{action.endpoint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pingResult[action.endpoint] && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{ background: pingResult[action.endpoint].includes('OK') ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: pingResult[action.endpoint].includes('OK') ? 'var(--accent-green)' : 'var(--lock-red)' }}>
                        {pingResult[action.endpoint]}
                      </span>
                    )}
                    <button onClick={() => pingEndpoint(action.endpoint, action.method)}
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <a href={action.endpoint} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--bg)', color: 'var(--accent-green)' }}>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-72 flex-shrink-0 border-l overflow-auto p-4 space-y-4"
          style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Selected Unit</p>
          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚁</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedDrone.name}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{selectedDrone.id}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Status',    value: selectedDrone.status,          color: STATUS_COLORS[selectedDrone.status] },
                { label: 'Latitude',  value: selectedDrone.lat,             color: 'var(--text)' },
                { label: 'Longitude', value: selectedDrone.lng,             color: 'var(--text)' },
                { label: 'Battery',   value: `${selectedDrone.battery}%`,   color: selectedDrone.battery > 50 ? 'var(--accent-green)' : selectedDrone.battery > 20 ? '#f59e0b' : 'var(--lock-red)' },
                { label: 'Signal',    value: `${selectedDrone.signal}%`,    color: 'var(--text)' },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                  <span className="font-mono capitalize" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          {selectedDrone.status === 'alert' && (
            <div className="rounded-xl border p-3 flex gap-2" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--lock-red)' }} />
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--lock-red)' }}>Alert Active</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Low battery + weak signal.</p>
                <a href="/api/nepa/anomalies/live" target="_blank" rel="noopener noreferrer"
                  className="text-xs mt-1 flex items-center gap-1 hover:opacity-80" style={{ color: 'var(--lock-red)' }}>
                  /api/nepa/anomalies/live <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Quick Actions</p>
            {[
              { label: 'Get Status',       endpoint: '/api/nepa/status' },
              { label: 'Dispatch Mission', endpoint: '/api/nepa/missions/dispatch' },
              { label: 'Inference Stream', endpoint: '/api/nepa/inference/stream' },
            ].map(a => (
              <a key={a.endpoint} href={a.endpoint} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg border text-xs hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg)' }}>
                <span>{a.label}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--muted)' }}>{a.endpoint}</span>
              </a>
            ))}
          </div>
          <button onClick={() => drawer.open('NEPA Inference')}
            className="w-full py-2.5 rounded-lg text-xs font-semibold border transition-opacity hover:opacity-80"
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>
            Unlock NEPA Pro Overlays
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
    </MembershipDrawerProvider>
  )
}
