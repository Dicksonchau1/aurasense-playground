import type {
  NEPAInferenceRequestMeta,
  NEPAInferenceResponse,
} from '@/types/nepa'

interface InferenceResult {
  ok: boolean
  data?: NEPAInferenceResponse
  error?: string
}

export async function postNEPAFrame(
  blob: Blob,
  meta: NEPAInferenceRequestMeta,
): Promise<InferenceResult> {
  try {
    const form = new FormData()
    form.append('frame', blob, 'frame.jpg')
    form.append('source', meta.source)
    form.append('region', JSON.stringify(meta.region))
    if (meta.userId) {
      form.append('user_id', meta.userId)
    }

    const res = await fetch('/api/nepa/inference/frame', {
      method: 'POST',
      body: form,
    })

    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const j = await res.json()
        if (j?.error) msg = j.error as string
      } catch {
        // ignore
      }
      return { ok: false, error: msg }
    }

    const data = (await res.json()) as NEPAInferenceResponse
    return { ok: true, data }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown network error'
    return { ok: false, error: msg }
  }
}
