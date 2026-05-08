'use client'

import { useMemo } from 'react'

interface Props {
  title?: string
  subtitle?: string
  p95Ms?: number | null
  blocks?: string[]
}

export function ShareCard({ title, subtitle, p95Ms, blocks }: Props) {
  const ogUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (title) params.set('title', title)
    if (subtitle) params.set('subtitle', subtitle)
    if (p95Ms != null && Number.isFinite(p95Ms)) params.set('p95', `${p95Ms.toFixed(1)}ms`)
    if (blocks && blocks.length) params.set('blocks', blocks.join(','))
    return `/api/og?${params.toString()}`
  }, [title, subtitle, p95Ms, blocks])

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${ogUrl}` : ogUrl
  const tweetText = encodeURIComponent(
    `${title ?? 'NEPA Playground'} — ${subtitle ?? 'real-time perception, live'} 🟢 via @aurasense_hk`
  )
  const tweetIntent = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">Share this run</p>
      <div className="mt-3 overflow-hidden rounded-lg border border-white/5 bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ogUrl} alt="Share preview" className="w-full" loading="lazy" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={tweetIntent}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
        >
          Share on X
        </a>
        <a
          href={liUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
        >
          Share on LinkedIn
        </a>
        <a
          href={ogUrl}
          download="aurasense-share.png"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
        >
          Download PNG
        </a>
      </div>
    </div>
  )
}
