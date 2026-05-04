# NEPA Audit Chain — Setup

## 1. Supabase project
- Create project at supabase.com (HK or SG region for low latency)
- Copy URL + anon key + service_role key into `.env.local` (see .env.local.example)

## 2. Run migration
   psql "$SUPABASE_DB_URL" -f supabase/001_audit_chain.sql
   # or paste into Supabase SQL editor

## 3. Create storage bucket
   pnpm tsx scripts/init-storage.ts

## 4. Boot Next.js
   pnpm dev

## 5. Test the loop
   - Visit /portal → sign in via magic link
   - Click any frame on /, /drone, or /rehearse
   - Refresh /portal — your inference should appear with thumbnail + row_hash

## 6. Verify chain integrity (anytime)
   pnpm tsx scripts/verify-chain.ts <your_user_uuid>

## Tamper-evident guarantee
Each row stores:
  row_hash = sha256(prev_hash || canonical_row_json)
Any mutation invalidates every subsequent hash. The genesis row's prev_hash is "GENESIS".
