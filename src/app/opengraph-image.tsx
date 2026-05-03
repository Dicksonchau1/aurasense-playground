import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Aura Rehearse — NEPA Playground'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 16 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ color: '#737373', fontSize: 24, letterSpacing: 4 }}>NEPA PLAYGROUND</span>
        </div>
        <div style={{ color: '#f5f5f5', fontSize: 80, fontWeight: 700, letterSpacing: -2, marginBottom: 16 }}>
          AURA REHEARSE
        </div>
        <div style={{ color: '#10b981', fontSize: 36, marginBottom: 48 }}>
          Reflects. Rehearses.
        </div>
        <div style={{ color: '#737373', fontSize: 24 }}>playground.aurasensehk.com</div>
      </div>
    ),
    { ...size }
  )
}
