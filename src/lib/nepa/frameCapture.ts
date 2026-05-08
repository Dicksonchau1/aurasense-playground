/**
 * Captures a cropped region from a <video> element into a JPEG Blob.
 *
 * @param video HTMLVideoElement (already playing)
 * @param region NEPARegionMeta (0-based row/col/index)
 * @returns Blob (image/jpeg) or null if capture fails
 */
import type { NEPARegionMeta } from '@/types/nepa'

export async function captureRegionAsBlob(
  video: HTMLVideoElement,
  region: NEPARegionMeta,
): Promise<Blob | null> {
  if (!video.videoWidth || !video.videoHeight) return null

  const vw = video.videoWidth
  const vh = video.videoHeight

  // 3x3 grid
  const tileW = vw / 3
  const tileH = vh / 3

  const sx = Math.round(region.col * tileW)
  const sy = Math.round(region.row * tileH)
  const sw = Math.round(tileW)
  const sh = Math.round(tileH)

  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh)

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob ?? null)
      },
      'image/jpeg',
      0.85,
    )
  })
}
