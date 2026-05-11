'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap, ChevronLeft, ChevronRight, Settings, Shield, FileText,
  Lock, LogOut, ExternalLink, MoreHorizontal, X, Home,
  Radio, Mic, Video, Activity
} from 'lucide-react'
import { useMembershipDrawer } from '@/components/membership-drawer'

const IS_PRO = false // wire to real auth later

export function AppSidebar() {
  const pathname = usePathname()
  const drawer = useMembershipDrawer()
  const [collapsed, setCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const NAV = [
    { href: '/',         label: 'Home',         icon: Home    },
    { href: '/rehearse', label: 'Aura Rehearse', icon: Video   },
    { href: '/drone',    label: 'Drone',         icon: Radio   },
    { href: '/facility', label: 'Facility',      icon: Activity, soon: true },
    { href: '/portal',   label: 'Portal',        icon: Activity, soon: true },
    { href: '/robotic',  label: 'Robotic',       icon: Activity, soon: true },
  ]

  const SETTINGS_ITEMS = IS_PRO ? [
    { label: 'Privacy',          icon: Shield,   href: '/api/nepa/settings/privacy'  },
    { label: 'Security',         icon: Lock,     href: '/api/nepa/settings/security' },
    { label: 'Terms & Policy',   icon: FileText, href: 'https://aurasensehk.com/terms' },
    { label: 'Log Out',          icon: LogOut,   href: '/', danger: true             },
  ] : [
    { label: 'Privacy',          icon: Shield,   href: 'https://aurasensehk.com/privacy' },
    { label: 'Terms & Policy',   icon: FileText, href: 'https://aurasensehk.com/terms'   },
    { label: 'AuraSense HK',     icon: ExternalLink, href: 'https://aurasensehk.com'     },
  ]

  return (
    <>
      <aside
        className="fixed left-0 top-12 bottom-0 z-30 flex flex-col transition-all duration-300"
        style={{
          width: collapsed ? '52px' : '220px',
          background: 'rgba(7,14,26,0.97)',
          borderRight: '1px solid rgba(16,185,129,0.1)',
          backdropFilter: 'blur(12px)',
        }}>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-5 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-opacity hover:opacity-80"
          style={{ background: '#0a1628', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(16,185,129,0.08)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                D
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: '#e2e8f0' }}>Dickson Chau</p>
                <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>dickson@aurasensehk.com</p>
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-4 border-b" style={{ borderColor: 'rgba(16,185,129,0.08)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
              D
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-auto py-3 px-2 space-y-0.5">
          {!collapsed && (
            <p className="text-[9px] font-mono uppercase tracking-widest px-2 py-1.5"
              style={{ color: 'rgba(16,185,129,0.4)' }}>NEPA PLAYGROUND</p>
          )}
          {NAV.map(({ href, label, icon: Icon, soon }) => {
            const active = pathname === href
            if (soon) return (
              <div key={href} className="flex items-center gap-2.5 px-2 py-2 rounded-lg opacity-30 cursor-default"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="flex-1 text-xs flex items-center justify-between">
                    {label}
                    <span className="text-[8px] rounded px-1" style={{ background: 'rgba(255,255,255,0.08)' }}>SOON</span>
                  </span>
                )}
              </div>
            )
            return (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all"
                title={collapsed ? label : undefined}
                style={{
                  background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: active ? '#10b981' : 'rgba(255,255,255,0.5)',
                  borderLeft: active ? '2px solid #10b981' : '2px solid transparent',
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="text-xs">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer — settings + external links */}
        <div className="border-t px-2 py-3 space-y-0.5 relative" style={{ borderColor: 'rgba(16,185,129,0.08)' }}>
          {!collapsed && (
            <>
              <a href="https://docs.aurasensehk.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-opacity hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                <ExternalLink className="w-4 h-4 flex-shrink-0" /> Docs
              </a>
              <a href="https://github.com/Dicksonchau1" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-opacity hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                <ExternalLink className="w-4 h-4 flex-shrink-0" /> GitHub
              </a>
            </>
          )}

          {/* Settings ··· button */}
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg w-full transition-opacity hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            title="Settings">
            <MoreHorizontal className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-xs">Settings</span>}
          </button>

          {/* Settings flyout */}
          {settingsOpen && (
            <div className="absolute bottom-14 left-2 right-2 rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{ background: '#0d1f35', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(16,185,129,0.7)' }}>
                  {IS_PRO ? 'Account' : 'AuraSense HK'}
                </p>
                <button onClick={() => setSettingsOpen(false)} style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {SETTINGS_ITEMS.map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs transition-opacity hover:opacity-80"
                  style={{ color: (item as any).danger ? '#ef4444' : 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                  {item.href.startsWith('http') && <ExternalLink className="w-2.5 h-2.5 ml-auto opacity-40" />}
                </a>
              ))}
              {!IS_PRO && (
                <button onClick={() => { setSettingsOpen(false); drawer.open('Pro Membership') }}
                  className="flex items-center gap-2.5 px-3 py-2.5 w-full text-xs transition-opacity hover:opacity-80"
                  style={{ color: '#10b981', borderTop: '1px solid rgba(16,185,129,0.15)' }}>
                  <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Spacer so content doesn't hide behind sidebar */}
      <div className="transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? '52px' : '220px' }} aria-hidden />
    </>
  )
}
