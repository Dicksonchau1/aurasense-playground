'use client'

import { BLOCK_LABELS, FREE_BLOCKS, PRO_BLOCKS, type NepaBlockKey } from '@/lib/playground-types'
import { cn } from '@/lib/utils'

interface Props {
  active: NepaBlockKey[]
  onToggle: (block: NepaBlockKey, next: boolean) => void
  /** When true, attempting to enable a PRO block will fire onPaywall. */
  isFree: boolean
  onPaywall?: (block: NepaBlockKey) => void
  disabled?: boolean
}

export function BlockToggle({ active, onToggle, isFree, onPaywall, disabled }: Props) {
  const all: NepaBlockKey[] = [...FREE_BLOCKS, ...PRO_BLOCKS]
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((block) => {
        const isOn = active.includes(block)
        const isPro = PRO_BLOCKS.includes(block)
        const locked = isFree && isPro
        return (
          <button
            key={block}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (locked) {
                onPaywall?.(block)
                return
              }
              onToggle(block, !isOn)
            }}
            className={cn(
              'group rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all',
              isOn
                ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white/80',
              locked && 'cursor-pointer opacity-70',
              disabled && 'cursor-not-allowed opacity-40'
            )}
          >
            <span className={cn('mr-1.5 inline-block h-1.5 w-1.5 rounded-full', isOn ? 'bg-emerald-400' : 'bg-white/20')} />
            {BLOCK_LABELS[block]}
            {isPro ? (
              <span className={cn('ml-1.5 text-[9px]', locked ? 'text-amber-300' : 'text-emerald-300/70')}>
                {locked ? '🔒 PRO' : 'PRO'}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
