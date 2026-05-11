import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Trash2, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: sessions } = await sb
    .from('sessions')
    .select('id, lane, created_at, ended_at, duration_sec, snapshot_url, session_metrics(envelope, consistency)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f5', margin: 0 }}>My Sessions</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>
          {user.email} · Last 10 sessions
        </p>
      </div>

      {(!sessions || sessions.length === 0) ? (
        <div style={{
          padding: '40px', textAlign: 'center',
          border: '1px dashed #262626', borderRadius: 12,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>No sessions yet. Start a rehearse or drone session.</p>
          <a href="/rehearse" style={{
            display: 'inline-block', marginTop: 12,
            padding: '8px 20px', borderRadius: 8, fontSize: 13,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            color: '#10b981', textDecoration: 'none',
          }}>Go to Rehearse →</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {sessions.map((s) => {
            const metrics = Array.isArray(s.session_metrics) ? s.session_metrics[0] : s.session_metrics
            const envelope = metrics?.envelope ?? null
            const consistency = metrics?.consistency ?? null
            const date = new Date(s.created_at as string).toLocaleDateString('en-HK', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })
            return (
              <div key={s.id as string} style={{
                background: '#111111', border: '1px solid #262626',
                borderRadius: 12, overflow: 'hidden',
              }}>
                {/* Snapshot thumbnail */}
                <div style={{ aspectRatio: '16/9', background: '#0a0a0a', position: 'relative' }}>
                  {s.snapshot_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.snapshot_url as string}
                      alt="Session snapshot"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>No snapshot</span>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                    background: 'rgba(0,0,0,0.6)',
                    color: s.lane === 'drone' ? '#f59e0b' : '#10b981',
                    border: `1px solid ${s.lane === 'drone' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  }}>
                    {String(s.lane).toUpperCase()}
                  </div>
                </div>

                <div style={{ padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{date}</p>
                  {(envelope !== null || consistency !== null) && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                      {envelope !== null && (
                        <span style={{ fontSize: 12, color: '#10b981' }}>
                          Envelope <strong>{envelope}</strong>
                        </span>
                      )}
                      {consistency !== null && (
                        <span style={{ fontSize: 12, color: '#3b82f6' }}>
                          Consistency <strong>{consistency}</strong>
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <a
                      href={`/rehearse/${s.id}`}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        padding: '6px', borderRadius: 7, fontSize: 11,
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                        color: '#60a5fa', textDecoration: 'none',
                      }}
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </a>
                    <DeleteButton sessionId={s.id as string} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DeleteButton({ sessionId }: { sessionId: string }) {
  return (
    <form
      action={`/api/session?id=${sessionId}`}
      method="post"
      style={{ display: 'contents' }}
      onSubmit={async (e) => {
        e.preventDefault()
        if (!confirm('Delete this session?')) return
        await fetch(`/api/session?id=${sessionId}`, { method: 'DELETE' })
        window.location.reload()
      }}
    >
      <button
        type="submit"
        title="Delete session"
        style={{
          padding: '6px 10px', borderRadius: 7, fontSize: 11,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#f87171', cursor: 'pointer',
        }}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </form>
  )
}
