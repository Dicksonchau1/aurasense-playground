# Vercel Environment Setup for NEPA Proxy

## Required Environment Variables

Set these in your Vercel project settings (Production/Preview):

- `NEPA_API_URL` — The internal NEPA backend URL (e.g. https://nepa-backend.internal)
- `NEPA_SERVICE_TOKEN` — Internal service-to-service token for NEPA API

**Do NOT set `NEXT_PUBLIC_NEPA_API_URL` in production.**
All frontend traffic should go through the Next.js API proxy (`/api/nepa/v1/hri/*`).

Supabase public keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) should be set as usual.
