import { Sidebar } from './sidebar'

interface PlaygroundShellProps {
  children: React.ReactNode
  metrics?: React.ReactNode
}

export function PlaygroundShell({ children, metrics }: PlaygroundShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      {metrics && (
        <div className="w-96 flex-shrink-0 border-l overflow-auto" style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
          {metrics}
        </div>
      )}
    </div>
  )
}