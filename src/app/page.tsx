import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* HERO with full-bleed background video */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero/scene-builder.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.95) 100%)',
          }}
        />

        {/* Cyan glow vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(34,211,238,0.10) 0%, transparent 65%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="mb-6" style={{
            fontFamily: 'ui-monospace, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.75rem',
            color: '#22d3ee',
          }}>
            Neuromorphic Perception · Live in your browser
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Watch the world model{' '}
            <span style={{ color: '#22d3ee' }}>come into the network</span>.
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.65 }}>
            AuraSense Playground lets you interact with NEPA — our event-driven
            perception chain — directly in your browser. Plug your video. Plug
            your robot. Plan your mission. Agnostic to upstream.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/rehearse" style={{
              background: '#22d3ee',
              color: '#000',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(34,211,238,0.3)',
              transition: 'all 200ms',
            }}>
              Open Aura Rehearse →
            </Link>
            <Link href="/drone" style={{
              background: 'transparent',
              color: '#f5f5f5',
              padding: '0.875rem 2rem',
              borderRadius: '0.5rem',
              border: '1px solid #1f2937',
              fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'all 200ms',
            }}>
              Try Drone Overlay
            </Link>
          </div>

          <p style={{
            marginTop: '2rem',
            fontFamily: 'ui-monospace, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.7rem',
            color: '#6b7280',
          }}>
            Free to try · HK$148/mo Pro · HK$888/mo Studio
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.7rem',
          color: '#6b7280',
          letterSpacing: '0.1em',
        }}>
          ↓ scroll
        </div>
      </section>

      {/* Four surfaces */}
      <section style={{ padding: '6rem 1.5rem', borderTop: '1px solid #1f2937' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center',
            fontFamily: 'ui-monospace, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.75rem',
            color: '#22d3ee',
            marginBottom: '1rem',
          }}>
            Four surfaces, one perception layer
          </p>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem' }}>
            Plug anything. NEPA processes.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <Link href="/rehearse" style={{ display: 'block', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1f2937', background: '#0a0a0a', textDecoration: 'none', color: 'inherit', transition: 'all 200ms' }}>
              <p style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: '#22d3ee', marginBottom: '0.75rem' }}>01 / Rehearse</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Voice Mirror</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.5 }}>Live envelope + consistency from your webcam. 100% in-browser.</p>
            </Link>
            <Link href="/drone" style={{ display: 'block', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1f2937', background: '#0a0a0a', textDecoration: 'none', color: 'inherit', transition: 'all 200ms' }}>
              <p style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: '#22d3ee', marginBottom: '0.75rem' }}>02 / Drone</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Video HUD</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.5 }}>Plug any video — sample, RTSP, WebRTC. NEPA overlays detections + telemetry.</p>
            </Link>
            <div style={{ display: 'block', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1f2937', background: '#0a0a0a', opacity: 0.6 }}>
              <p style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: '#22d3ee', marginBottom: '0.75rem' }}>03 / Robotics 🔒</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Robot Registry</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.5 }}>Coming soon — register any robot with AuraSense schema or URDF.</p>
            </div>
            <div style={{ display: 'block', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1f2937', background: '#0a0a0a', opacity: 0.6 }}>
              <p style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: '#22d3ee', marginBottom: '0.75rem' }}>04 / Planner 🔒</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Waypoint Plan</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.5 }}>Coming soon — plan once, export to ROS2, PX4, MAVLink, or JSON.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is NEPA */}
      <section style={{ padding: '6rem 1.5rem', borderTop: '1px solid #1f2937' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'ui-monospace, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.75rem',
            color: '#22d3ee',
            marginBottom: '1rem',
          }}>
            What is NEPA
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            A perception chain, not a black box
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: 1.7 }}>
            NEPA orchestrates five small, deterministic blocks — early_discard, roi_only,
            polygon_zone, imu_parse, events_only — into a sub-millisecond perception loop.
            End-to-end p95: <span style={{ color: '#22d3ee', fontWeight: 600 }}>117 µs</span> measured deterministically.
          </p>
        </div>
      </section>
    </main>
  );
}
