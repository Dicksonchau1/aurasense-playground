import { PlaygroundShell } from '@/components/playground-shell'

export default function DronePage() {
  return (
    <PlaygroundShell>
      <div className="flex items-center justify-center h-full p-6">
        <div
          className="rounded-2xl p-8 max-w-sm w-full text-center border"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <span className="text-2xl">🚁</span>
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
            Drone Playground — coming soon
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>
            Live AI overlay on any drone or camera feed. Paste an RTSP or SRT URL, see it work.
          </p>

          <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
            NEPA Playground <span className="mx-1">›</span> Drone
          </p>

          <a
            href="mailto:hello@aurasensehk.com?subject=Drone%20waitlist"
            className="block w-full py-3 rounded-xl text-center text-sm font-semibold mt-4 transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-green)', color: '#000' }}
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </PlaygroundShell>
  )
}
