'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FrameClickable } from '@/components/frame-clickable'
import { Plane, Battery, Signal, AlertCircle, Radio } from 'lucide-react'

interface Drone { id: string; model: string; status: string; battery: number; region: string }

export default function DronePage() {
  const [drones, setDrones] = useState<Drone[]>([])
  const [active, setActive] = useState<string>('UAV-001')
  const [feedMode, setFeedMode] = useState<'video' | 'webcam'>('video')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    fetch('/api/registry/drones').then(r => r.json()).then(j => setDrones(j?.data?.units ?? []))
      .catch(() => {})
  }, [])

  // Optional: hook a real MediaStream (webcam stand-in for drone WebRTC feed)
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
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setFeedMode('video')
  }
  useEffect(() => () => streamRef.current?.getTracks().forEach(t => t.stop()), [])

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
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-mono pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                {active} · {feedMode === 'webcam' ? 'WEBRTC' : '4K'} · 30fps
              </div>
              <div className="absolute top-2 right-2 z-10 flex gap-1 pointer-events-none">
                <div className="px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1"
                  style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                  <Signal className="w-3 h-3" /> 92%
                </div>
              </div>
            </FrameClickable>
          </div>

          {/* Fleet list */}
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
          </div>
        </div>

        <p className="mt-4 text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Click any 9-region tile on the live feed — actual pixels are captured and POSTed to de>/api/nepa/inference/frame</code>.
        </p>
      </section>
    </main>
  )
}
