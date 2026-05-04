'use client'
import React from 'react'
import { FrameClickable } from '@/components/frame-clickable'

export default function HomePage() {
  return (
    <main className="min-h-dvh pt-16 pb-12 px-4" style={{ background: '#070e1a', color: 'white' }}>
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          AI perception that <span style={{ color: '#10b981' }}>predicts</span>, not recognises.
        </h1>
        <p className="mt-3 text-sm max-w-2xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Click anywhere on the live feed below — the actual pixels are captured and sent to NEPA for inference.
        </p>

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
      </section>
    </main>
  )
}
