'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'

const MODULES = [
  {
    id: 'rehearse',
    title: 'Aura Rehearse',
    tagline: 'Interview practice mirror',
    description: 'AI-powered nursing interview rehearsal with Whisper transcription and Claude 5-axis feedback. HK Nursing Council aware.',
    status: 'LIVE',
    statusColor: '#10b981',
    href: '/rehearse/nurse',
    icon: 'R',
    metrics: ['13 HK scenarios', 'Psych · Community · ICU · General', '5-axis Claude scoring'],
  },
  {
    id: 'attas',
    title: 'Attas Drone',
    tagline: 'Drone-agnostic inspection',
    description: 'Real-time NEPA edge inference across DJI, Autel, Parrot, Skydio, Pixhawk, Ardupilot, custom builds. Every inspection technique.',
    status: 'LIVE',
    statusColor: '#10b981',
    href: '/playground/attas',
    icon: 'D',
    metrics: ['10 inspection modes', 'LiDAR · Thermal · Chem · Photogrammetry', 'Jetson Orin edge AI'],
  },
  {
    id: 'facility',
    title: 'NEPA Facility',
    tagline: 'Building intelligence',
    description: 'Smart building inference for facade inspection, occupancy, anomaly detection. Hospital + ICC-tier deployments.',
    status: 'Q3 2026',
    statusColor: '#f59e0b',
    href: '#',
    icon: 'F',
    metrics: ['Coming soon', 'Hospital cluster pilots', 'Smart building infra'],
  },
]

export default function PlaygroundIndex() {
  return (
    <main style={{ minHeight: '100vh', background: '#070e1a', color: '#e6edf3', padding: 32, fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>AuraSense Playground</p>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '8px 0 0' }}>Three modules, one platform</h1>
        <p style={{ fontSize: 14, color: '#8b949e', marginTop: 8 }}>Drone-agnostic real-time inference. HK & GBA institutions. NEPA edge AI on Jetson Orin.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginTop: 32 }}>
          {MODULES.map(m => (
            <Link key={m.id} href={m.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: 24, minHeight: 280 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: m.statusColor + '22', border: '1px solid ' + m.statusColor + '55', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700, color: m.statusColor }}>{m.icon}</div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 99, background: m.statusColor + '22', color: m.statusColor, border: '1px solid ' + m.statusColor + '55' }}>{m.status}</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: '16px 0 4px', color: '#e6edf3' }}>{m.title}</h2>
                <p style={{ fontSize: 12, color: '#34d399', fontStyle: 'italic', margin: 0 }}>{m.tagline}</p>
                <p style={{ fontSize: 13, color: '#8b949e', marginTop: 12, lineHeight: 1.5 }}>{m.description}</p>
                <ul style={{ fontSize: 11, color: '#8b949e', paddingLeft: 16, marginTop: 14, lineHeight: 1.6 }}>
                  {m.metrics.map(x => (>{x}</li>))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 24, background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12 }}>
          <h3 style={{ fontSize: 14, color: '#a78bfa', margin: 0 }}>For institutions</h3>
          <p style={{ fontSize: 13, color: '#e6edf3', marginTop: 8, lineHeight: 1.6 }}>
            HK$60,000/semester per drone cohort · HK$1,488/mo per nursing cohort · Faculty/Enterprise pricing on request.
          </p>
          <a href="/pricing" style={{ display: 'inline-block', marginTop: 12, padding: '8px 14px', borderRadius: 6, background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.4)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>View pricing</a>
        </div>
      </div>
    </main>
  )
}
