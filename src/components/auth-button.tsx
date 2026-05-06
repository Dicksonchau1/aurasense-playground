'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const sb = createClient()

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function signOut() {
    await sb.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return null

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <UserIcon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </span>
        <button
          onClick={signOut}
          title="Sign out"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 8, fontSize: 11,
            background: 'transparent', border: '1px solid #262626',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          }}
        >
          <LogOut className="w-3 h-3" />
          Sign out
        </button>
      </div>
    )
  }

  return (
    <a
      href="/login"
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 8, fontSize: 11,
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
        color: '#10b981', textDecoration: 'none', cursor: 'pointer',
      }}
    >
      <LogIn className="w-3 h-3" />
      Sign in
    </a>
  )
}
