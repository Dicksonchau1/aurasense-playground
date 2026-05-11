# MIGRATION_AUDIT.md

## Phase 0 — Pre-flight Audit (May 11, 2026)

### 1. Repo Structure (root)
- .next/ (build output)
- nepa_runtime/ (contains Makefile, Python backend, proto, scripts, tests)
- ops/ (deployment, Docker, scripts)
- public/ (static assets)
- docs/ (documentation)
- infra/supabase/migrations/ (SQL migrations)
- src/ (Next.js app, components, lib, proto, types)
- supabase/ (SQL, migrations, README)
- tests/ (unit tests)
- package.json, next.config.mjs, tsconfig.json, etc.

### 2. Next.js Version & Router
- **Next.js version:** 16.2.4 (from package.json)
- **React version:** 19.2.4
- **App Router:** Yes (src/app/layout.tsx exists, uses new app directory structure)

### 3. Existing Components & Layout
- Main layout: src/app/layout.tsx
- Key providers/components: MembershipDrawerProvider, NavBar, AppSidebar, Analytics
- Uses modern Next.js layout and providers pattern

### 4. NEPA Backend (nepa_runtime/)
- Contains Makefile, Python backend, proto, scripts, tests
- Appears to be a checked-in vendored copy of NEPA backend (not just config)

### 5. Supabase Client Location
- Supabase browser client: src/lib/supabase/client.ts
- Supabase server client: src/lib/supabase/server.ts
- Both use @supabase/ssr and environment variables for config

### 6. Other Notes
- Flat repo structure (not yet a monorepo)
- .env.example and .env.local.example present
- next.config.mjs disables type and eslint build errors

---

_This audit was generated as Phase 0 of the monorepo migration and backend wiring process. All subsequent phases reference this file._
