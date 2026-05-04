'use client'
import React, { useState } from 'react'
import { FrameClickable } from '@/components/frame-clickable'
import { Sparkles, RefreshCw } from 'lucide-react'

const SCENES = [
  { id: 'warehouse', label: 'Warehouse Patrol',  src: '/hero/world-model-stdp.mp4' },
  { id: 'rooftop',   label: 'Rooftop Inspection', src: '/hero/world-model-stdp.mp4' },
  { id: 'corridor',  label: 'Indoor Corridor',    src: '/hero/scene-builder.mp4'    },
]

export default function RehearsePage() {
  const [scene, setScene] = useState(SCENES[0])
  const [seed, setSeed] = useState(42)

  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4" style={{ color: '#10b981' }} />
          <h1 className="text-2xl font-bold">Rehearse</h1>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            SCENE-BUILDER
          </span>
        </div>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Synthetic scenes from the world model. Click anywhere on the preview to capture that exact frame and run NEPA inference.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <FrameClickable source={`rehearse-${scene.id}`} fullFrameOnClick style={{ aspectRatio: '16/9', background: '#000' }}>
              <video
                key={scene.id + seed}
                src={scene.src}
                autoPlay loop muted playsInline crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-mono pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                {scene.label.toUpperCase()} · seed {seed}
              </div>
            </FrameClickable>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(16,185,129,0.7)' }}>Scenes</p>
            {SCENES.map(s => {
              const active = scene.id === s.id
              return (
                <button key={s.id} onClick={() => setScene(s)}
                  className="w-full text-left rounded-xl p-3 transition-all"
                  style={{
                    background: active ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                    border: active ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <p className="text-xs font-semibold" style={{ color: active ? '#10b981' : 'rgba(255,255,255,0.85)' }}>{s.label}</p>
                  <p className="text-[10px] mt-0.5 font-mono opacity-50" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.src}</p>
                </button>
              )
            })}

            <button onClick={() => setSeed(Math.floor(Math.random() * 9999))}
              className="w-full mt-2 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
              <RefreshCw className="w-3 h-3" /> Re-roll seed
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
