export async function captureScreenshot(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement
): Promise<string> {
  const offscreen = document.createElement('canvas')
  offscreen.width = videoEl.videoWidth
  offscreen.height = videoEl.videoHeight
  const ctx = offscreen.getContext('2d')!
  ctx.drawImage(videoEl, 0, 0)
  ctx.drawImage(canvasEl, 0, 0)
  return offscreen.toDataURL('image/png')
}

export function buildShareURL(scores: { envelope: number; consistency: number }): string {
  const params = new URLSearchParams({
    e: String(scores.envelope),
    c: String(scores.consistency),
  })
  return 'https://playground.aurasensehk.com/rehearse?' + params
}
