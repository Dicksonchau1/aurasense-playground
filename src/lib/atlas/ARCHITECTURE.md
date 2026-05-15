# ATLAS architecture (post-cleanup pass)

ATLAS is composed of four clean layers. Every audit-layer section, hook, and
UI component reads from this architecture, and any new ATLAS work should
follow the same shape.

## 1. Mission-state layer
Canonical facts about the mission and its evidence index.

- Single source of truth for: mission identity, audience, rule set, verdict,
  duration, prepared-by, prepared-at, and the canonical evidence index.
- Implemented in `mission-state.tsx` via `MissionStateProvider` and
  `useMissionState` (`useRequiredMissionState` for required contexts).
- Backward compatible: hooks that consume mission state fall back to local
  defaults when no provider is mounted.

## 2. Slice-hook layer
Per-section local logic, encapsulated as hooks.

- Each hook owns its own local interactions (selection, filtering, draft
  notes, decision rationale, capture cadence, etc.).
- When `MissionStateProvider` is present, hooks read their initial seed and
  any cross-slice references from it, and sync through small reconciliation
  effects on relevant mission-state changes.
- When no provider is present, hooks behave exactly as before. This is what
  makes incremental adoption safe across SFSVC, Playground, and NEPA shells.

## 3. Orchestrator layer
Unified outbound posture derived from mission state and per-slice progress.

- `useArduPilotMissionScope` composes signals from the evidence bundle and
  regulatory compliance slices (both seeded from mission state) and produces
  one outbound verdict plus explicit blocking reasons.
- The orchestrator owns no independent truth. It is strictly derivative,
  which is what prevents UI drift between bundle, compliance, export,
  disclosure, brief, and summary.
- The shell (e.g., `AuditShellInner`) wires hooks and view-models together,
  surfaces the orchestrator at the top via `MissionScopeBar`, and passes
  view-models into the presentation layer.

## 4. Presentation layer
Section components consume view-models and action handlers only.

- Sections are declarative and never own outbound truth.
- View-models are produced by pure transformation functions in
  `view-models-ardupilot.ts`, keeping the UI thin and replaceable.

## Why this matters

- **Consistency**: All audit-layer hooks and sections are synchronized
  through one canonical mission state. Silent disagreements between
  independently-mocked slice states are structurally prevented, not
  reconciled after the fact.
- **Incremental adoption**: The provider is opt-in. Shells that have not
  migrated still work, which lets ATLAS surfaces adopt the pattern shell by
  shell rather than in one breaking sweep.
- **Rehearsal and sandboxing**: Because mission state is one object with a
  known shape, it can be snapshotted, replayed, or substituted. The same
  audit surface can be driven by a live mission, a rehearsed mission, or a
  historical mission with no shell-level changes. This is the property that
  unlocks Playground rehearsal and NEPA-style deterministic replay.
- **Governance**: Outbound posture across evidence bundle, compliance,
  export, disclosure, brief, and summary is governed by one orchestrator
  reading from one canonical mission state. That is the property that makes
  the surface defensible to regulators, ITF reviewers, customer auditors,
  and family-office VCs.

## Extension rules

When adding a new ATLAS section:

1. If it consumes or operates on mission identity, audience, rule set,
   verdict, duration, or shared evidence references, seed the hook from
   `useMissionState` and write a small reconciliation effect for any
   mission-state field the hook mirrors.
2. Keep all per-panel local interactions inside the hook. Do not push them
   into mission state.
3. If the section is outbound-relevant (evidence packaging, disclosure,
   compliance, brief, summary), route its readiness into the orchestrator
   through a new signal in `useArduPilotMissionScope` rather than inventing
   a parallel coordination mechanism.
4. Keep the section thin: it should consume one view-model and a small set
   of action handlers, nothing more.
