---
title: AuraSense Playground Full Implementation Plan
feature: aurasense-playground
status: in-progress
created: 2026-05-12
updated: 2026-05-12
---

# AuraSense Playground: Full Implementation Plan

## Overview
This plan covers the full implementation of the AuraSense Playground, integrating Rehearse-Nurse, ATTAS, and Robotics into a unified, multi-mode, institutionally tiered, demo-ready platform. The approach is mock-first, UI-visible, and robust for demo scenarios.

## Phases

### Phase A: Project & Schema Setup
- [ ] Establish monorepo structure (apps, packages, services)
- [ ] Define unified TypeScript types for all modules
- [ ] Set up Supabase schema for users, roles, audit, and session data
- [ ] Configure RLS on all tables
- [ ] Add institutional SSO (Supabase Auth)

### Phase B: Core UI Shell & Routing
- [ ] Create Next.js App Router structure for Playground
- [ ] Implement multi-mode dashboard (Rehearse-Nurse, ATTAS, Robotics)
- [ ] Add left-rail navigation and collapsible right-rail panels
- [ ] Centralize demo state (React context or Zustand)
- [ ] Add dark mode and brand tokens (Tailwind)

### Phase C: Mock API & Adapters
- [ ] Scaffold Next.js API routes for all backend capabilities
- [ ] Implement polling adapters with mock fallback for each capability
- [ ] Add fetchJSON utility and error handling
- [ ] Wire up polling to UI state

### Phase D: Module UI Integration
- [ ] Rehearse-Nurse: Integrate MediaPipe pipeline, session FSM, and feedback UI
- [ ] ATTAS: Integrate 3D map overlays (MapLibre GL + deck.gl), policy parser, and audit chain
- [ ] Robotics: Add control panel, telemetry, and status overlays
- [ ] Ensure all modules emit Merkle audit leaves

### Phase E: Demo & QA
- [ ] Add demo script overlay and walkthrough mode
- [ ] Implement centralized logging and error reporting
- [ ] Achieve 80%+ test coverage (unit + integration)
- [ ] Validate all flows with mock and real data

### Phase F: Deployment & Monitoring
- [ ] Prepare Vercel and Hostinger VPS deployment configs
- [ ] Add Application Insights or Sentry for monitoring
- [ ] Document deployment and usage in README

## Acceptance Criteria
- All backend capabilities surfaced in UI with mock fallback
- Centralized demo state and robust error handling
- Institutional SSO and RLS enforced
- 3D map overlays and MediaPipe pipeline functional
- Merkle audit chain visible in UI
- 80%+ test coverage and monitoring enabled
- Demo script runs end-to-end

## Demo Script
1. Login as institutional user
2. Switch between Playground modes (Rehearse-Nurse, ATTAS, Robotics)
3. Show real-time vision inference and 3D overlays
4. Trigger policy overlays and audit events
5. Walk through demo script overlay
6. Validate audit chain and logs

---
_Last updated: 2026-05-12_