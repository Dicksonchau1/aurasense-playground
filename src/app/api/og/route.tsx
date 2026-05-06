import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const BG = '#070e1a'
const ACCENT = '#10b981'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'NEPA Playground').slice(0, 80)
  const subtitle = (searchParams.get('subtitle') ?? 'Real-time perception, live').slice(0, 120)
  const p95 = searchParams.get('p95')
  const blocks = (searchParams.get('blocks') ?? '').split(',').filter(Boolean).slice(0, 5)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${BG} 0%, #0d1828 60%, #061018 100%)`,
          color: 'white',
          padding: '64px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: ACCENT,
              boxShadow: `0 0 24px ${ACCENT}`,
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: ACCENT,
              fontWeight: 700,
            }}
          >
            AuraSense · NEPA
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1,
            display: 'flex',
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: 'rgba(255,255,255,0.72)',
            display: 'flex',
            maxWidth: 980,
          }}
        >
          {subtitle}
        </div>

        <div style={{ flexGrow: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {p95 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 24px',
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: 16,
              }}
            >
              <span style={{ fontSize: 14, color: ACCENT, letterSpacing: 2 }}>P95 LATENCY</span>
              <span style={{ fontSize: 44, fontWeight: 700, color: 'white' }}>{p95}</span>
            </div>
          ) : null}
          {blocks.length > 0 ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 760 }}>
              {blocks.map((b) => (
                <div
                  key={b}
                  style={{
                    display: 'flex',
                    padding: '10px 16px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontSize: 22,
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 20,
            color: 'rgba(255,255,255,0.45)',
            display: 'flex',
          }}
        >
          playground.aurasensehk.com · live edge GPU inference
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
