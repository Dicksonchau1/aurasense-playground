'use client'
import type { CapturedFrame } from './capture-frame'

type FrameHandler = (frame: CapturedFrame, source: string) => void
let _handler: FrameHandler | null = null

export function registerFrameHandler(fn: FrameHandler) { _handler = fn }
export function dispatchFrame(frame: CapturedFrame, source: string) {
  if (_handler) _handler(frame, source)
  else console.warn('[nepa-bus] No frame handler registered (NavBar not mounted?)')
}
