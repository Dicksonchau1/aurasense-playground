'use client'
/**
 * AuraCoach — realtime clinical-perception feedback agent.
 *
 * Polls `/api/v1/coach/feedback` (NEPA, proxied) at most every 2 seconds
 * and renders a glassmorphic floating card with severity-coded border and
 * an optional Web-Speech / ElevenLabs voice line.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchCoachFeedback,
  fetchCoachScenarios,
  playCoachVoice,
} from '@/lib/coach/client'
import { fallbackCoachResponse } from '@/lib/coach/messages'
import type {
  CoachKpi,
  CoachResponse,
  CoachScenario,
  CoachScenarioMap,
  CoachSeverity,
  CoachVerdict,
} from '@/lib/coach/types'
import { SEVERITY_COLORS } from '@/lib/coach/types'

const POLL_MS = 2000
const MAX_FAILURES = 3

export interface AuraCoachProps {
  scenario: CoachScenario
  step: number
  totalSteps: number
  kpi: CoachKpi
  recentVerdicts: CoachVerdict[]
  sessionId: string
  tier: 'free' | 'nursing' | 'enterprise'
  enabled?: boolean
  voiceEnabled?: boolean
  position?: 'right' | 'left' | 'bottom'
}

function speak(text: string, rate: number) {
  if (typeof window === 'undefined') return
  const synth = window.speechSynthesis
  if (!synth) return
  try {
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    synth.speak(u)
  } catch {
    /* swallow */
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function positionStyle(pos: AuraCoachProps['position']): React.CSSProperties {
  switch (pos) {
    case 'left':
      return { left: 16, bottom: 16 }
    case 'bottom':
      return { left: '50%', bottom: 16, transform: 'translateX(-50%)' }
    default:
      return { right: 16, bottom: 16 }
  }
}

export default function AuraCoach({
  scenario,
  step,
  totalSteps,
  kpi,
  recentVerdicts,
  sessionId,
  tier,
  enabled = true,
  voiceEnabled = true,
  position = 'right',
}: AuraCoachProps) {
  const [resp, setResp] = useState<CoachResponse | null>(null)
  const [failures, setFailures] = useState(0)
  const [dismissedError, setDismissedError] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [scenarios, setScenarios] = useState<CoachScenarioMap | null>(null)
  const elapsedRef = useRef<number>(Date.now())
  const lastMessageRef = useRef<string>('')

  // One-shot scenario fetch (cached).
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    fetchCoachScenarios().then(s => {
      if (!cancelled) setScenarios(s)
    })
    return () => {
      cancelled = true
    }
  }, [enabled])

  // Polling loop.
  const tick = useCallback(async () => {
    const elapsed = (Date.now() - elapsedRef.current) / 1000
    const result = await fetchCoachFeedback({
      session_id: sessionId,
      scenario,
      step,
      total_steps: totalSteps,
      kpi,
      recent_verdicts: recentVerdicts.slice(-5),
      elapsed_sec: elapsed,
      tier,
    })
    if (result) {
      setResp(result)
      setFailures(0)
      setDismissedError(false)
    } else {
      setFailures(f => f + 1)
      // Use templated fallback so the UI still updates locally.
      setResp(prev => prev ?? fallbackCoachResponse(scenario, kpi))
    }
  }, [scenario, step, totalSteps, kpi, recentVerdicts, sessionId, tier])

  useEffect(() => {
    if (!enabled) return
    let stopped = false
    const run = async () => {
      while (!stopped) {
        await tick()
        await new Promise(r => setTimeout(r, POLL_MS))
      }
    }
    run()
    return () => {
      stopped = true
    }
  }, [enabled, tick])

  // Voice — only when message changes.
  useEffect(() => {
    if (!resp || !voiceEnabled) return
    if (resp.message === lastMessageRef.current) return
    lastMessageRef.current = resp.message
    setSpeaking(true)
    const useEleven = process.env.NEXT_PUBLIC_COACH_VOICE_ELEVENLABS === '1'
    const done = () => setSpeaking(false)
    if (useEleven) {
      playCoachVoice(resp.message, 'default', resp.voice_hint?.rate ?? 1.0).finally(done)
    } else {
      speak(resp.message, resp.voice_hint?.rate ?? 1.0)
      const t = setTimeout(done, 3500)
      return () => clearTimeout(t)
    }
  }, [resp, voiceEnabled])

  const borderColor = useMemo<string>(() => {
    const sev = (resp?.severity ?? 'OBSERVATION') as CoachSeverity
    return SEVERITY_COLORS[sev] ?? SEVERITY_COLORS.OBSERVATION
  }, [resp])

  if (!enabled) return null

  const reduced = prefersReducedMotion()
  const errorBanner = failures >= MAX_FAILURES && !dismissedError
  const message = resp?.message ?? 'Initializing coach…'
  const tag = resp?.tag ?? 'POSTURE'
  const sev = resp?.severity ?? 'OBSERVATION'
  const action = resp?.suggested_action

  const scenarioMeta = scenarios?.[scenario]

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        zIndex: 60,
        minWidth: 260,
        maxWidth: 340,
        padding: '12px 14px',
        background: 'rgba(17, 24, 39, 0.92)',
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        color: '#e2e8f0',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'border-color 180ms cubic-bezier(0.16,1,0.3,1)',
        ...positionStyle(position),
      }}
      data-testid="aura-coach"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#22d3ee,#a78bfa)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            color: '#0d1117',
            position: 'relative',
          }}
        >
          A
          <span
            style={{
              position: 'absolute',
              right: -2,
              bottom: -2,
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #111827',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#8899aa', letterSpacing: 0.4 }}>
            AURACOACH · {tag}
          </div>
          <div style={{ fontSize: 11, color: '#4a5568', fontFamily: 'Geist Mono, monospace' }}>
            {scenario} · step {step}/{totalSteps}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            padding: '2px 7px',
            borderRadius: 999,
            color: borderColor,
            border: `1px solid ${borderColor}`,
            letterSpacing: 0.4,
          }}
        >
          {sev}
        </span>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.4 }}>{message}</div>

      {action && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: '#8899aa',
            fontFamily: 'Geist Mono, monospace',
          }}
        >
          → {action}
        </div>
      )}

      {scenarioMeta?.tone && (
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: '#4a5568',
            fontFamily: 'Geist Mono, monospace',
          }}
        >
          tone: {scenarioMeta.tone}
        </div>
      )}

      {!reduced && speaking && (
        <div style={{ display: 'flex', gap: 3, marginTop: 8, alignItems: 'flex-end', height: 12 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              style={{
                width: 3,
                height: 6 + ((i * 3) % 6),
                background: borderColor,
                borderRadius: 1,
                animation: `auracoach-wave 800ms ease-in-out ${i * 80}ms infinite`,
              }}
            />
          ))}
          <style>{`@keyframes auracoach-wave {
            0%,100%{transform:scaleY(0.5)}
            50%{transform:scaleY(1.4)}
          }`}</style>
        </div>
      )}

      {errorBanner && (
        <div
          style={{
            marginTop: 10,
            padding: '6px 8px',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 8,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#f59e0b',
          }}
        >
          <span style={{ flex: 1 }}>Coach unavailable — running on cached cues.</span>
          <button
            type="button"
            onClick={() => setDismissedError(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f59e0b',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
            }}
            aria-label="Dismiss coach error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
