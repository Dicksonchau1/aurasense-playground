'use client'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center"
      style={{ background: '#070e1a', fontFamily: 'monospace' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      {/* Grid */}
      <div className="pointer-events-none fixed inset-0 opacity-30"
        style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo mark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 24px rgba(16,185,129,0.15)' }}>
            <Zap className="w-5 h-5" style={{ color: '#10b981' }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold tracking-widest uppercase" style={{ color: '#10b981' }}>AuraSense HK</p>
            <p className="text-[10px] tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>NEPA Playground</p>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>
            Neuromorphic Perception<br />
            <span style={{ color: '#10b981' }}>Orchestration</span>
          </h1>
          <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Live drone overlay · Aura Rehearse · NEPA inference runtime.
            Nothing leaves your device.
          </p>
        </div>

        {/* Big enter button */}
        <Link href="/drone"
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base tracking-wide transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#000', boxShadow: '0 0 40px rgba(16,185,129,0.3), 0 4px 24px rgba(0,0,0,0.4)' }}>
          <Zap className="w-5 h-5" />
          Enter Playground
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Sublinks */}
        <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <Link href="/rehearse" className="hover:text-emerald-400 transition-colors">Aura Rehearse</Link>
          <a href="https://aurasensehk.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">AuraSense HK ↗</a>
          <a href="https://github.com/Dicksonchau1" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub ↗</a>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            RUNTIME ONLINE
          </span>
          <span>·</span>
          <span>SHA-256 AUDIT CHAIN</span>
          <span>·</span>
          <span>V0.4</span>
        </div>
      </div>
    </div>
  )
}
