import crypto from 'crypto'

export function sha256(input: string | Buffer): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export function nowISO(): string { return new Date().toISOString() }

export function auditId(prefix = 'nepa'): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`
}

export function jitter(min: number, max: number): number {
  return +(Math.random() * (max - min) + min).toFixed(3)
}

export interface NepaEnvelope<T> {
  ok: boolean
  audit_id: string
  ts: string
  latency_ms: number
  sha256: string
  data: T
}

export function envelope<T>(data: T, started: number): NepaEnvelope<T> {
  const payload = JSON.stringify(data)
  return {
    ok: true,
    audit_id: auditId(),
    ts: nowISO(),
    latency_ms: Date.now() - started,
    sha256: sha256(payload),
    data,
  }
}
