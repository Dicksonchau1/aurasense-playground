---
goal: AuraSense Playground Closure & Platform Unification Implementation Plan
version: 1.0
date_created: 2026-05-13
owner: AuraSense Engineering
status: 'Planned'
tags: [feature, closure, unification, demo-safe, auditability, persistence, compliance, Next.js, FastAPI, Supabase, Stripe, TypeScript]
---

# Introduction

This implementation plan details the full closure pass for the AuraSense Platform, focusing on unifying the /playground, /rehearse, and /drone (ATTAS) surfaces into a coherent, demo-safe, and institution-ready product. The plan follows a strict build order, ensuring each phase is completed before the next, with a focus on real functionality, auditability, persistence, and graceful degradation. No placeholders or dead ends are permitted; every route, button, and module must be intentional and operational.

## 1. Requirements & Constraints

- **REQ-001**: /playground must be the canonical entry point and system unifier.
- **REQ-002**: All module cards and navigation must open real, functional routes or actions.
- **REQ-003**: No placeholder, "coming soon", or dead-end UI elements.
- **REQ-004**: Shared state, audit, and fallback language across all surfaces.
- **REQ-005**: All clinical scenarios for Nursing Phase C must be fully implemented.
- **REQ-006**: ATTAS must be live-wired to backend or degrade gracefully to last-known-good state.
- **REQ-007**: All persistence, audit, and compliance features must be cross-surface and demo-safe.
- **SEC-001**: All user actions and session data must be auditable and persist securely.
- **SEC-002**: Graceful handling of denied permissions, backend outages, and degraded states.
- **CON-001**: No restructuring of routes unless required by implementation logic.
- **CON-002**: No breaking of existing working routes during refactoring.
- **GUD-001**: Prefer additive enhancement over destructive rewrite.
- **PAT-001**: Use shared design tokens, state pills, and card/button patterns across all surfaces.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Unify /playground as the canonical entry point and product shell.

| Task     | Description                                                                                      | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-001 | Refactor /playground/page.tsx to provide a clear product frame and system hierarchy              | completed | 2026-05-13 |
| TASK-002 | Implement live module cards for Aura Rehearse and ATTAS SANDBOX with real links                  | completed | 2026-05-13 |
| TASK-003 | Add shared KPI/status summary strip reflecting system state                                      | completed | 2026-05-13 |
| TASK-004 | Remove all placeholder modules, dead buttons, and "coming soon" language                         | completed | 2026-05-13 |
| TASK-005 | Apply consistent visual language and design tokens as used in /rehearse and /drone               | completed | 2026-05-13 |
| TASK-006 | Validate that all visible modules open real, functional routes                                   | completed | 2026-05-13 |

### Implementation Phase 2

- GOAL-002: Standardize app contract and UI/UX language across /playground, /rehearse, and /drone.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-007 | Normalize state pills (live/degraded/offline), loading, and empty states across all surfaces      | completed | 2026-05-13 |
| TASK-008 | Standardize audit badge language and session status naming                                       | completed | 2026-05-13 |
| TASK-009 | Unify route naming, entry behavior, and theme handling                                           | completed | 2026-05-13 |
| TASK-010 | Apply shared card/button/typography patterns                                                     | completed | 2026-05-13 |
| TASK-011 | Implement fallback ribbons for backend unreachable states                                        | completed | 2026-05-13 |
| TASK-012 | Standardize shell actions: open session, review trace, export, stop, reset                       | completed | 2026-05-13 |
| TASK-013 | Validate cross-surface consistency and intentional degraded-mode experience                      | completed | 2026-05-13 |

### Implementation Phase 3

- GOAL-003: Complete Nursing Phase C end-to-end in /rehearse.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-014 | Implement real getUserMedia camera feed and MediaPipe Hands + Pose detection                     | completed | 2026-05-14 |
| TASK-015 | Wire all selected clinical scenarios with correct switching, rails, labels, and logic            |           |      |
| TASK-016 | Implement dual-write persistence: Supabase (canonical) + NEPA (fire-and-forget/live post)        |           |      |
| TASK-017 | Implement signed verdict/audit chain and instructor override/hold path                           |           |      |
| TASK-018 | Add anomaly drawer/detail flow and graceful failure ribbons                                      |           |      |
| TASK-019 | Validate full session flow: scenario select, camera grant, activity, feedback, session complete  |           |      |
| TASK-020 | Ensure calm, visible fallback for NEPA/Supabase/model service degradation                        |           |      |

### Implementation Phase 4

- GOAL-004: Implement Nursing tutor and institutional proof layer.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-021 | Implement tutor-assigned scenarios and policy overlay editor/assignment interface                 |           |      |
| TASK-022 | Implement instructor override actions and multi-learner supervision patterns                     |           |      |
| TASK-023 | Add attention/anomaly surfacing for tutors                                                       |           |      |
| TASK-024 | Implement session review, audit export, and institution-focused analytics                        |           |      |
| TASK-025 | Validate multi-learner supervision and tutor intervention flows                                  |           |      |

### Implementation Phase 5

- GOAL-005: Demo-harden the nursing loop for all major failure and edge cases.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-026 | Test and handle denied/delayed camera permission, low-confidence detection, backend outages       |           |      |
| TASK-027 | Implement reconnect flow, empty assignment state, malformed verdict row handling                  |           |      |
| TASK-028 | Ensure educator intervention is robust during live session                                        |           |      |
| TASK-029 | Validate all failure states present visible explanations and next steps                           |           |      |
| TASK-030 | Ensure no crash, blank pane, or silent failure in any major branch                                |           |      |

### Implementation Phase 6

- GOAL-006: Complete ATTAS live backend wiring and graceful degradation.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-031 | Wire ATTAS panels/routes to live backend endpoints or last-known-good state                       |           |      |
| TASK-032 | Implement telemetry, weather, geofence, RID/compliance, mission state, recording/replay panels    |           |      |
| TASK-033 | Add Merkle/audit feed, vendor registry, and map/mission overlays                                 |           |      |
| TASK-034 | Ensure all panels degrade gracefully if backend is unavailable                                    |           |      |
| TASK-035 | Validate ATTAS as a real, operational screen with no decorative-only panels                      |           |      |

### Implementation Phase 7

- GOAL-007: Express ATTAS vendor, physics, and environment depth.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-036 | Implement brand/model selectors, task selectors, and building selection from map/facade           |           |      |
| TASK-037 | Integrate physics-aware behavior (drift, mass, wind, stabilizer, etc.) where already built        |           |      |
| TASK-038 | Add windsheer, sunlight, LiDAR, heatmap, chem-map, and sensor overlays as applicable              |           |      |
| TASK-039 | Enable mission behavior comparison/explanation for different vendors/environments                  |           |      |
| TASK-040 | Validate ATTAS teaches as well as operates                                                        |           |      |

### Implementation Phase 8

- GOAL-008: Complete ATTAS compliance and export polish.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-041 | Implement/harden compliance modules/pages and SOP/policy framing                                  |           |      |
| TASK-042 | Add Hong Kong-specific policy surfaces where defined                                              |           |      |
| TASK-043 | Implement exportable evidence/report flows and recording/replay review                            |           |      |
| TASK-044 | Add audit-chain visibility and compliance status summaries                                        |           |      |
| TASK-045 | Validate compliance is integrated and legible for non-engineering reviewers                       |           |      |

### Implementation Phase 9

- GOAL-009: Unify cross-surface persistence and observability.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-046 | Implement/harden session persistence, trace review, event timelines, verdict/audit visibility     |           |      |
| TASK-047 | Add last-known-good fallback state and replay/reconstruction flows                                |           |      |
| TASK-048 | Validate session review is coherent across nursing and ATTAS                                      |           |      |
| TASK-049 | Ensure observability patterns are shared, not reinvented per module                               |           |      |

### Implementation Phase 10

- GOAL-010: Final demo-safe QA pass and closure.

| Task     | Description                                                                                      | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-050 | Route walk: validate all main routes and sub-views open correctly                                |           |      |
| TASK-051 | Click walk: validate all buttons, tabs, sidebars, and module cards are intentional               |           |      |
| TASK-052 | Empty-state walk: ensure no empty state is broken or unstyled                                    |           |      |
| TASK-053 | Failure-state walk: validate all fallback ribbons and degraded states                            |           |      |
| TASK-054 | Data walk: ensure live panels populate from real endpoints or last-known-good state              |           |      |
| TASK-055 | Mobile and theme consistency sanity pass                                                         |           |      |
| TASK-056 | Copy pass: remove vague/inconsistent wording and prototype language                              |           |      |
| TASK-057 | Demo narrative pass: ensure system tells one coherent story                                      |           |      |
| TASK-058 | No-placeholder audit: remove all "coming soon", fake badges, and dead-end cards                  |           |      |
| TASK-059 | Validate platform is demo-safe for academic, enterprise, and partner stakeholders                |           |      |

## 3. Alternatives

- **ALT-001**: Implementing placeholder modules or routes for incomplete features (rejected: violates product principles).
- **ALT-002**: Skipping demo-hardening or QA pass (rejected: risks demo failure and incoherent product feel).

## 4. Dependencies

- **DEP-001**: Next.js, Supabase, Stripe, TypeScript (frontend)
- **DEP-002**: FastAPI, NEPA backend endpoints (backend)
- **DEP-003**: MediaPipe Hands + Pose (browser detection)
- **DEP-004**: Existing ATTAS integration map and route plan
- **DEP-005**: Design tokens and shared UI components

## 5. Files

- **FILE-001**: /playground/page.tsx — Playground shell and entry point
- **FILE-002**: /rehearse/* — Nursing clinical loop, scenario logic, session flows
- **FILE-003**: /drone/* — ATTAS panels, backend wiring, compliance modules
- **FILE-004**: /components/shared/* — Shared UI components, state pills, cards, buttons
- **FILE-005**: /lib/persistence/* — Persistence, audit, and observability logic
- **FILE-006**: /styles/* — Design tokens, typography, theme handling
- **FILE-007**: /api/* — API routes for session, audit, compliance, etc.

## 6. Testing

- **TEST-001**: End-to-end route and click walk tests for all main surfaces
- **TEST-002**: Unit and integration tests for scenario switching, session persistence, and audit logic
- **TEST-003**: Failure and degraded state tests for all major backend dependencies
- **TEST-004**: UI/UX snapshot and regression tests for shared components
- **TEST-005**: Mobile and theme consistency tests for critical views

## 7. Risks & Assumptions

- **RISK-001**: Breaking existing working routes during shell refactor
- **RISK-002**: Backend endpoints may be incomplete or unstable
- **RISK-003**: Demo-hardening may miss rare edge cases
- **ASSUMPTION-001**: All required backend endpoints and clinical scenarios are defined and available
- **ASSUMPTION-002**: Shared design tokens and UI components are up to date

## 8. Related Specifications / Further Reading

- [AuraSense Platform Architecture Spec]
- [ATTAS Integration Map & Route Plan]
- [Nursing Phase C Clinical Scenario List]
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MediaPipe Hands + Pose](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)
