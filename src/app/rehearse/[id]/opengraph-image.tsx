import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: session } = await sb
    .from('sessions')
    .select('lane, created_at, session_metrics(envelope, consistency)')
    .eq('id', id)
    .single()

  const metrics = session
    ? (Array.isArray(session.session_metrics) ? session.session_metrics[0] : session.session_metrics)
    : null
  const envelope = metrics?.envelope ?? null
  const consistency = metrics?.consistency ?? null
  const lane = session?.lane ?? 'rehearse'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #070e1a 0%, #0d1f35 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
        }}>
          <div style={{
            padding: '6px 16px', borderRadius: 24, fontSize: 14, fontWeight: 700,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
          }}>
            {String(lane).toUpperCase()}
          </div>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>AuraSense Playground</span>
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 800, color: '#f5f5f5', margin: '0 0 12px', lineHeight: 1.1 }}>
          Aura Session
        </h1>
        <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', margin: '0 0 48px' }}>
          Real-time presence analysis · 100% in-browser
        </p>

        {/* Score row */}
        {(envelope !== null || consistency !== null) && (
          <div style={{ display: 'flex', gap: 40 }}>
            {envelope !== null && (
              <div>
                <p style={{ fontSize: 14, color: 'rgba(16,185,129,0.8)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Envelope</p>
                <p style={{ fontSize: 72, fontWeight: 800, color: '#10b981', margin: 0, lineHeight: 1 }}>{envelope}</p>
              </div>
            )}
            {consistency !== null && (
              <div>
                <p style={{ fontSize: 14, color: 'rgba(59,130,246,0.8)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Consistency</p>
                <p style={{ fontSize: 72, fontWeight: 800, color: '#60a5fa', margin: 0, lineHeight: 1 }}>{consistency}</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom URL */}
        <div style={{
          position: 'absolute', bottom: 40, right: 80,
          fontSize: 16, color: 'rgba(255,255,255,0.25)',
        }}>
          playground.aurasensehk.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
