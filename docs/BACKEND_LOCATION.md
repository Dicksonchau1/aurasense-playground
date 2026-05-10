# Where the playground backend lives

The Aura Rehearse playground backend (`/api/v1/playground/*` endpoints)
is in the **private `nepa` repo**, not here.

This repo (`aurasense-playground-1`) is the **frontend only**:
- React + Vite + Storybook
- Static deploy target: `playground.aurasensehk.com`

The frontend talks to the backend via:
- `VITE_API_BASE_URL=https://api.aurasensehk.com`
- Endpoints: `/api/v1/playground/nursing/*`

For backend changes, see the private `nepa` repo:
- `nepa/api/v1/playground/auth.py`
- `nepa/api/v1/playground/router.py`
- `nepa/api/v1/playground/scenarios.py`
- `nepa/api/v1/playground/reports.py`
- `nepa/api/v1/playground/ws.py`
- (plus billing, rate_limit, schemas)
