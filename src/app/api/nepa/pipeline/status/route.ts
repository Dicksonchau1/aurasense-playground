import { NextResponse } from 'next/server'
import { envelope, jitter } from '@/lib/nepa'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STAGES = [
  'sensor_ingestion','spike_encoding','stdp_learning','world_model_prior',
  'perception_fusion','anomaly_detection','agent_reasoning','action_orchestration',
  'audit_chain','continual_learning_loop',
]

export async function GET() {
  const t = Date.now()
  return NextResponse.json(envelope({
    stages: STAGES.map((name, i) => ({
      n: i + 1, name,
      status: 'healthy',
      throughput_hz: jitter(28, 34),
      latency_ms: jitter(0.8, 4.2),
    })),
    total_latency_ms: jitter(8, 14),
  }, t))
}
