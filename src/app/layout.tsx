import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { MembershipDrawerProvider } from '@/components/membership-drawer'
import { NavBar } from '@/components/nav-bar'
import { AppSidebar } from '@/components/app-sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aura Rehearse — NEPA Playground',
  description: 'Reflects. Rehearses. Your private practice mirror. Nothing leaves your device.',
  metadataBase: new URL('https://playground.aurasensehk.com'),
  openGraph: {
    title: 'Aura Rehearse — NEPA Playground',
    description: 'Reflects. Rehearses. Your private practice mirror. Nothing leaves your device.',
    url: 'https://playground.aurasensehk.com/rehearse',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Rehearse — NEPA Playground',
    description: 'Live envelope score + consistency index from your webcam. 100% in-browser.',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#070e1a', margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <MembershipDrawerProvider>
          <NavBar />
          <div style={{ display: 'flex', flex: 1, paddingTop: '3rem' }}>
            <AppSidebar />
            <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
              {children}
            </main>
          </div>
        </MembershipDrawerProvider>
        <Analytics />
      </body>
    </html>
  )
}
