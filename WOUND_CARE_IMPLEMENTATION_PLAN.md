# Wound Care Module — Detailed Implementation Plan

## 1. Dressing Recommendation Engine
- **Goal:** Output ≥1 valid dressing for every wound profile in the test corpus.
- **Backend:**
  - `AuraSense_NEPA/services/wound_care/app/domain/dressing_rules.py`: Implement dressing rules logic.
  - `AuraSense_NEPA/services/wound_care/app/routers/dressing.py`: API endpoint for recommendations.
  - **Test:** Ensure all test corpus profiles return at least one valid dressing.
- **Frontend:**
  - `apps/www/components/wound-care/DressingRecommendation.tsx`: UI for displaying recommendations.

## 2. HRI Popup on Disagreement
- **Goal:** When auto-recommended dressing ≠ nurse's choice, fire HRI popup.
- **Backend:**
  - `hri_triggers.py`: Logic to detect disagreement and trigger event.
- **Frontend:**
  - `apps/www/components/sandbox/OverlayMarkerList.tsx`: Display HRI popup to tutor only.

## 3. AuditEvent on Capture
- **Goal:** Each capture writes a `wound_assessed` AuditEvent with `photo_hash` linking to per-institution bucket.
- **Backend:**
  - `capture.py`: On capture, generate photo_hash, write AuditEvent.
  - `packages/audit-events/src/kinds/wound_assessed.ts`: Define event schema.
- **Infra:**
  - Ensure per-institution bucket logic is enforced.

## 4. Healing Trajectory Chart
- **Goal:** Render ≥2 past visits with area-over-time line + tissue stack.
- **Backend:**
  - `trajectory.py`: API to fetch past visit data.
- **Frontend:**
  - `apps/www/components/wound-care/TrajectoryChart.tsx`: Chart rendering logic.

## 5. Capture UI
- **Goal:** Enable wound photo capture and submission.
- **Frontend:**
  - `apps/www/components/wound-care/WoundCapture.tsx`: UI for photo capture and upload.
- **Backend:**
  - `capture.py`: Endpoint to receive and process photo.

## 6. Page Integration
- **Goal:** Integrate all components into the main Wound Care page.
- **Frontend:**
  - `apps/www/app/clinical/wound-care/page.tsx`: Compose capture, recommendation, and chart components.

## 7. Testing & Validation
- **Backend:**
  - Unit and integration tests for dressing rules, capture, and trajectory endpoints.
- **Frontend:**
  - Component and E2E tests for UI flows.

## 8. Documentation
- Update `docs/CLINICAL_MODULES.md` and `docs/SANDBOX_ARCHITECTURE.md` with module details and API contracts.

---
**Next Steps:**
1. Scaffold backend dressing rules and recommendation endpoint.
2. Scaffold frontend DressingRecommendation component.
3. Implement capture logic and AuditEvent writing.
4. Build trajectory chart backend and frontend.
5. Integrate all components in the main page.
6. Write and run tests.
7. Update documentation.
