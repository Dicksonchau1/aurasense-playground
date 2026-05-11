'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main
      className="min-h-dvh flex items-center justify-center px-4"
      style={{ background: '#070e1a', color: 'white' }}
    >
      <section className="max-w-2xl w-full text-center">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.25em] mb-4"
          style={{ color: '#10b981' }}
        >
          AuraSense Playground
        </p>

        <h1
          className="text-4xl md:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: 'white' }}
        >
          NEPA inference, <span style={{ color: '#10b981' }}>live</span>.
        </h1>

        <p
          className="mt-4 text-sm md:text-base max-w-md mx-auto"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          A minimal sandbox for the AuraSense NEPA runtime. Try the live drone feed,
          rehearse a scene, or open the agent in the corner.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/drone"
            className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
            style={{
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981',
            }}
          >
            Drone Console <ArrowRight className="w-3 h-3" />
          </Link>

          <Link
            href="/rehearse"
            className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Rehearse <ArrowRight className="w-3 h-3" />
          </Link>

          <Link
            href="/portal"
            className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Portal <ArrowRight className="w-3 h-3" />
          </Link>

          <a
            href="https://www.aurasensehk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            ← Marketing site
          </a>
        </div>

        <p
          className="mt-12 text-[10px] font-mono"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          AuraSense Ltd · Kowloon, Hong Kong ·{' '}
          <Link href="/privacy" className="hover:underline" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Privacy
          </Link>{' '}
          ·{' '}
          <Link href="/terms" className="hover:underline" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Terms
          </Link>
        </p>
      </section>
    </main>
  )
}
