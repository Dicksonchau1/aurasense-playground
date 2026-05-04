'use client'
import React from 'react'
import { FrameClickable } from '@/components/frame-clickable'
import { WorldModelSection } from '@/components/world-model-section'
import { TenStageSection } from '@/components/ten-stage-section'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-dvh pt-16 pb-12" style={{ background: '#070e1a', color: 'white' }}>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
            NEPA · WORLD MODEL · STDP
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          AI perception that <span style={{ color: '#10b981' }}>predicts</span>, not recognises.
        </h1>
        <p className="mt-3 text-sm md:text-base max-w-2xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
          AuraSense fuses spike-timing dependent plasticity with a latent world model. Click any region of the hero below to dispatch that frame slice to the NEPA runtime.
        </p>

        {/* Hero video */}
        <div className="mt-6 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          <FrameClickable source="hero" style={{ aspectRatio: '16/9', background: '#000' }}>
            <video
              src="/hero/world-model-stdp.mp4"
              autoPlay loop muted playsInline crossOrigin="anonymous"
              onError={(e) => {
                const v = e.currentTarget
                if (!v.src.endsWith('/hero/scene-builder.mp4')) v.src = '/hero/scene-builder.mp4'
              }}
              className="w-full h-full object-cover"
            />
          </FrameClickable>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/drone" className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
            View Drone Console <ArrowRight className="w-3 h-3" />
          </a>
          <a href="/rehearse" className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}>
            Rehearse Scene <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>

      <div className="my-8 max-w-6xl mx-auto px-4">
        <div style={{ height: 1, background: 'rgba(16,185,129,0.15)' }} />
      </div>

      {/* World Model — public section */}
      <WorldModelSection />

      <div className="my-8 max-w-6xl mx-auto px-4">
        <div style={{ height: 1, background: 'rgba(16,185,129,0.15)' }} />
      </div>

      {/* 10-Stage Pipeline — public section */}
      <TenStageSection />
    </main>
  )
}
