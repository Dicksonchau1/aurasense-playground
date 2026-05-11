/**
 * Grab the current frame from a <video> element as a JPEG data URL + Blob.
 * Works for same-origin videos (our /public assets) and WebRTC MediaStreams.
 * Will throw a SecurityError on cross-origin videos without CORS.
 */
export interface CapturedFrame {
  dataUrl: string
  blob: Blob
  width: number
  height: number
  ts: number
  region?: { x: number; y: number; w: number; h: number; label: string }
}

export async function captureVideoFrame(
  video: HTMLVideoElement,
  opts?: { region?: { x: number; y: number; w: number; h: number; label: string }; quality?: number }
): Promise<CapturedFrame> {
  const w = video.videoWidth
  const h = video.videoHeight
  if (!w || !h) throw new Error('Video has no dimensions yet')

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D context unavailable')
  ctx.drawImage(video, 0, 0, w, h)

  // Optional crop
  let outCanvas = canvas
  if (opts?.region) {
    const r = opts.region
    const c = document.createElement('canvas')
    c.width = r.w; c.height = r.h
    const cctx = c.getContext('2d')!
    cctx.drawImage(canvas, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h)
    outCanvas = c
  }

  const quality = opts?.quality ?? 0.85
  const dataUrl = outCanvas.toDataURL('image/jpeg', quality)
  const blob: Blob = await new Promise((res, rej) =>
    outCanvas.toBlob(b => (b ? res(b) : rej(new Error('toBlob failed'))), 'image/jpeg', quality)
  )

  return {
    dataUrl,
    blob,
    width: outCanvas.width,
    height: outCanvas.height,
    ts: Date.now(),
    region: opts?.region,
  }
}

/** Convert 3x3 grid label (NW/N/NE/W/C/E/SW/S/SE) into pixel rect. */
export function regionRect(label: string, w: number, h: number) {
  const map: Record<string, [number, number]> = {
    NW: [0, 0], N: [1, 0], NE: [2, 0],
    W:  [0, 1], C: [1, 1], E:  [2, 1],
    SW: [0, 2], S: [1, 2], SE: [2, 2],
  }
  const [cx, cy] = map[label] ?? [1, 1]
  const cw = Math.floor(w / 3)
  const ch = Math.floor(h / 3)
  return { x: cx * cw, y: cy * ch, w: cw, h: ch, label }
}
