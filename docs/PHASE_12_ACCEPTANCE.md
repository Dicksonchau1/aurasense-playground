# Phase 12 Acceptance Criteria

- [ ] **12.1 Build & type integrity**
  - [ ] `pnpm install` from a clean clone < 90s
  - [ ] `pnpm -r typecheck` exits 0 across all workspaces
  - [ ] `pnpm turbo run build` exits 0, zero peer-dep warnings
  - [ ] `pnpm -r lint` exits 0

- [ ] **12.2 CI / CD integrity**
  - [ ] CI / build green on last 3 commits to main
  - [ ] E2E / playwright green on latest PR
  - [ ] Vercel production = Ready
  - [ ] Preview URL auto-commented on every PR

- [ ] **12.3 Runtime — local**
  - [ ] `pnpm --filter @aurasense/www dev` boots with no console errors
  - [ ] DevTools shows open EventStream on `/api/nepa/v1/hri/stream`
  - [ ] No CORS, no 4xx/5xx on `/api/nepa/v1/hri/*`

- [ ] **12.4 Closed loop — the demo gate**
  - [ ] POST `/debug/fire` → HriPopup visible in ≤ 2 seconds
  - [ ] Click option → popup dismisses in ≤ 500 ms
  - [ ] `/respond` returns 200
  - [ ] `neuro_rehab` log shows `[stdp] teacher_signal applied …` within 1s
  - [ ] SODA chain grows by exactly one `hri_interaction` row
  - [ ] `chain_hash = sha256(prev_hash + payload)` verifies

- [ ] **12.5 Audit page**
  - [ ] `/audit` renders new `hri_interaction` row within 5s
  - [ ] Row shows Q:, A:, truncated chain=…
  - [ ] All four event kinds render without TS errors

- [ ] **12.6 Security**
  - [ ] Missing X-Service-Token → 401
  - [ ] Authorization never appears in Sentry / pino output
  - [ ] 31 rapid /respond calls → 30 succeed, 1 returns 429
  - [ ] `NEXT_PUBLIC_NEPA_API_URL` NOT set in production

- [ ] **12.7 Consolidation primer**
  - [ ] `python -m services.roda.app.jobs.consolidation` finds ≥ 1 HRI event
  - [ ] Prints a bundle.version ULID
  - [ ] Ed25519 signature verifies against SODA public key

- [ ] **12.8 Documentation**
  - [ ] `docs/MIGRATION_AUDIT.md` committed (Phase 0)
  - [ ] `docs/PHASE_12_ACCEPTANCE.md` committed (this checklist)
  - [ ] `docs/HRI_LOOP.md` — one-page architecture diagram + sequence
  - [ ] `README.md` updated with pnpm dev, pnpm build, "How the loop works"
