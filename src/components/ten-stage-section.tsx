'use client'
import React, { useState } from 'react'
import { Workflow, ChevronRight, Cpu, Eye, Brain, Layers, Network, GitBranch, CircuitBoard, ShieldCheck, Zap } from 'lucide-react'

const AGENTIC_STAGES = [
  { n: 1,  label: 'Sensor Ingestion',        icon: Eye,          desc: 'Multi-modal input: RGB, depth, audio, IMU streams arrive via WebRTC/RTSP.' },
  { n: 2,  label: 'Spike Encoding',          icon: Zap,          desc: 'Raw signals converted to sparse spike trains via temporal contrast coding.' },
  { n: 3,  label: 'STDP Learning',           icon: Brain,        desc: 'Spike-Timing Dependent Plasticity adapts synaptic weights online — no backprop.' },
  { n: 4,  label: 'World Model Prior',       icon: Network,      desc: 'Latent dynamics model predicts next-frame state across spatial + temporal axes.' },
  { n: 5,  label: 'Perception Fusion',       icon: Layers,       desc: 'STDP outputs fused with world model priors into a unified perception graph.' },
  { n: 6,  label: 'Anomaly Detection',       icon: CircuitBoard, desc: 'Prediction error spikes trigger anomaly flags — no face recognition.' },
  { n: 7,  label: 'Agent Reasoning',         icon: Cpu,          desc: 'VODA/CODA agents plan responses using perception graph + mission context.' },
  { n: 8,  label: 'Action Orchestration',    icon: Workflow,     desc: 'NEPA dispatches commands to drones, robots, or downstream services.' },
  { n: 9,  label: 'Audit & SHA-256 Chain',   icon: ShieldCheck,  desc: 'Every decision hashed into immutable audit log for compliance + replay.' },
  { n: 10, label: 'Continual Learning Loop', icon: GitBranch,    desc: 'Outcomes feed back as STDP reinforcement — closing the hybrid learning loop.' },
]

export function TenStageSection() {
  const [expanded, setExpanded] = useState<number | null>(1)

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-4">
        <Workflow className="w-5 h-5" style={{ color: '#10b981' }} />
        <h2 className="text-2xl font-bold" style={{ color: 'white' }}>10-Stage NEPA Pipeline</h2>
        <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
          AGENTIC FLOW
        </span>
      </div>

      <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
        From sensor ingestion to continual learning, every NEPA decision flows through 10 stages — each one auditable, replayable, and SHA-256 chained.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {AGENTIC_STAGES.map(stage => {
          const Icon = stage.icon as any
          const isOpen = expanded === stage.n
          return (
            <button key={stage.n}
              onClick={() => setExpanded(isOpen ? null : stage.n)}
              className="w-full text-left rounded-xl p-3 transition-all"
              style={{
                background: isOpen ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: isOpen ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#10b981' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono opacity-50" style={{ color: '#10b981' }}>
                    STAGE {stage.n.toString().padStart(2, '0')}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                    {stage.label}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ color: 'rgba(255,255,255,0.4)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }} />
              </div>
              {isOpen && (
                <p className="mt-2 text-[11px] leading-relaxed pl-11" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {stage.desc}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
