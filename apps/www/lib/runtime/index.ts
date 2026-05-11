import { RuntimeAdapter } from './types'
import { mockAdapter }   from './mock-adapter'
import { httpAdapter }   from './http-adapter'
import { tritonAdapter } from './triton-adapter'
import { grpcAdapter }   from './grpc-adapter'

export type RuntimeMode = 'grpc' | 'triton' | 'http' | 'mock'

let _cached: RuntimeAdapter | null = null
let _cachedMode: RuntimeMode | null = null

export function pickRuntime(): RuntimeAdapter {
  const mode = (process.env.NEPA_RUNTIME_MODE ?? 'mock').toLowerCase() as RuntimeMode
  if (_cached && _cachedMode === mode) return _cached
  switch (mode) {
    case 'grpc':   _cached = process.env.NEPA_RUNTIME_GRPC   ? grpcAdapter   : mockAdapter; break
    case 'triton': _cached = process.env.NEPA_RUNTIME_TRITON ? tritonAdapter : mockAdapter; break
    case 'http':   _cached = process.env.NEPA_RUNTIME_URL    ? httpAdapter   : mockAdapter; break
    default:       _cached = mockAdapter
  }
  _cachedMode = mode
  return _cached
}

/** Inference with automatic fallback to mock if real runtime errors. */
export async function inferFrameSafe(
  image: Buffer, meta: { source?: string; region?: string; userId?: string }
) {
  const primary = pickRuntime()
  try { return await primary.inferFrame(image, meta) }
  catch (e) {
    console.error('[nepa-runtime] primary failed → mock fallback:', (e as Error).message)
    return await mockAdapter.inferFrame(image, meta)
  }
}

export async function inferVideoSafe(
  video: Buffer, meta: { filename?: string; userId?: string }
) {
  const primary = pickRuntime()
  if (!primary.inferVideo) return await mockAdapter.inferVideo!(video, meta)
  try { return await primary.inferVideo(video, meta) }
  catch (e) {
    console.error('[nepa-runtime] video primary failed → mock fallback:', (e as Error).message)
    return await mockAdapter.inferVideo!(video, meta)
  }
}
