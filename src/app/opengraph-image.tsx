import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Aura Rehearse — NEPA Playground'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%',
            border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{ color: '#737373', fontSize: '18px' }}>NEPA Playground</span>
        </div>
        <h1 style={{ color: '#f5f5f5', fontSize: '80px', fontWeight: 700, margin: '0 0 16px', letterSpacing: '-2px' }}>AURA REHEARSE</h1>
        <p style={{ color: '#10b981', fontSize: '32px', margin: '0 0 12px' }}>Reflects. Rehearses.</p>
        <p style={{ color: '#737373', fontSize: '20px', margin: 0 }}>playground.aurasensehk.com/rehearse</p>
      </div>
    ),
    { ...size }
  )
}