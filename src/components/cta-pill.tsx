'use client'
import { Key } from 'lucide-react'

interface CtaPillProps {
  isActive: boolean
  hasPermission: boolean
  onStart: () => void
  onStop: () => void
}

export function CtaPill({ isActive, hasPermission, onStart, onStop }: CtaPillProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isActive ? onStop : onStart}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: isActive ? 'var(--border)' : 'var(--accent-green)',
          color: isActive ? 'var(--text)' : '#000',
        }}
      >
        {isActive ? (
          <><span>■</span> End session</>
        ) : (
          <>Start Rehearsal <kbd className="text-xs opacity-70 font-mono">⌘↵</kbd></>
        )}
      </button>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
          title={hasPermission ? 'Camera active' : 'No camera permission'}
        >
          <Key className="w-4 h-4" style={{ color: 'var(--muted)' }} />
        </button>
        {!hasPermission && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
            style={{ background: 'var(--lock-red)', borderColor: 'var(--bg)' }} />
        )}
      </div>
    </div>
  )
}