import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Share2, Trophy, BarChart3 } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const sb = await createClient()
  const { data } = await sb.from('sessions').select('id, lane, created_at').eq('id', id).single()
  if (!data) return {}
  const title = `AuraSense ${data.lane === 'drone' ? 'Drone' : 'Rehearse'} Session`
  return {
    title,
    openGraph: {
      title,
      images: [`/rehearse/${id}/opengraph-image`],
    },
    twitter: { card: 'summary_large_image', title, images: [`/rehearse/${id}/opengraph-image`] },
  }
}

export default async function SessionSharePage({ params }: Props) {
  const { id } = await params
  const sb = await createClient()
  const { data: session } = await sb
    .from('sessions')
    .select('*, session_metrics(envelope, consistency, posture, gaze, framing, pacing)')
    .eq('id', id)
    .single()

  if (!session) notFound()

  const metrics = Array.isArray(session.session_metrics)
    ? session.session_metrics[0]
    : session.session_metrics
  const envelope = metrics?.envelope ?? null
  const consistency = metrics?.consistency ?? null
  const date = new Date(session.created_at as string).toLocaleDateString('en-HK', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const shareUrl = `https://playground.aurasensehk.com/rehearse/${id}`

  const laneScores = metrics ? [
    { label: 'Posture', value: metrics.posture },
    { label: 'Gaze', value: metrics.gaze },
    { label: 'Framing', value: metrics.framing },
    { label: 'Pacing', value: metrics.pacing },
  ].filter(l => l.value != null) : []

  return (
    <div style={{ padding: '32px 20px', maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981',
          }}>
            {String(session.lane ?? 'rehearse').toUpperCase()}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{date}</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f5f5f5', margin: 0 }}>
          Session Replay
        </h1>
      </div>

      {/* Snapshot */}
      {session.snapshot_url && (
        <div style={{
          width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden',
          border: '1px solid #262626', marginBottom: 24,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={session.snapshot_url as string} alt="Session snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Score cards */}
      {(envelope !== null || consistency !== null) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {envelope !== null && (
            <ScoreCard icon={<Trophy className="w-4 h-4" />} label="Envelope" value={envelope} color="#10b981" />
          )}
          {consistency !== null && (
            <ScoreCard icon={<BarChart3 className="w-4 h-4" />} label="Consistency" value={consistency} color="#3b82f6" />
          )}
        </div>
      )}

      {/* Lane breakdown */}
      {laneScores.length > 0 && (
        <div style={{
          background: '#111111', border: '1px solid #262626',
          borderRadius: 12, padding: '16px 18px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Lane Breakdown
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {laneScores.map(lane => (
              <LaneBar key={lane.label} label={lane.label} value={lane.value as number} />
            ))}
          </div>
        </div>
      )}

      {/* Share row */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => navigator.clipboard.writeText(shareUrl)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', cursor: 'pointer',
          }}
        >
          <Share2 className="w-3.5 h-3.5" />
          Copy share link
        </button>
        <a href="/rehearse" style={{
          display: 'flex', alignItems: 'center',
          padding: '9px 18px', borderRadius: 9, fontSize: 13,
          background: 'transparent', border: '1px solid #262626',
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
        }}>
          New session →
        </a>
      </div>
    </div>
  )
}

function ScoreCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{
      background: '#111111', border: '1px solid #262626', borderRadius: 12,
      padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color }}>
        {icon}
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      </div>
      <p style={{ fontSize: 36, fontWeight: 700, margin: 0, color }}>{value}</p>
    </div>
  )
}

function LaneBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#f5f5f5' }}>{value}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: '#262626' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${Math.min(100, value)}%`,
          background: `hsl(${value * 1.2}, 70%, 55%)`,
        }} />
      </div>
    </div>
  )
}
