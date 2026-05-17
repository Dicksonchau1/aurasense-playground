# ATLAS Dashboard — Phase 1 Foundation Refactor

This directory contains the extracted and refactored JavaScript logic from the original `atlas-dashboard.html` template, as part of the Phase 1 implementation for productionizing the ATLAS Drone Inspection Command Platform.

## Files
- `app.js`: All dashboard logic previously inline in the HTML.
- `helpers.js`: UI helper functions for rendering repeated patterns (HUD, badges, panels).
- `store.js`: Global Atlas state store with pub/sub for view reactivity.

## Next Steps
- Wire these modules into the HTML template (script tags).
- Verify all views render identically to the original template.
- No CSS, layout, or design token changes are made in this phase.

---
**Do not redesign or restyle.**

---
