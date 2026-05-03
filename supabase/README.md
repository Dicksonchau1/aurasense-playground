# Supabase

Migrations live under `supabase/migrations/` and are applied in order.

## Apply locally

```bash
# Requires the Supabase CLI: https://supabase.com/docs/guides/cli
supabase db push
```

## Apply to a hosted project

Either run `supabase db push --linked` after `supabase link --project-ref <ref>`,
or paste each `*.sql` file into the SQL editor in the Supabase dashboard in
order.

## V1 schema

| Migration | Tables / objects |
| --- | --- |
| `0001_profiles.sql` | `profiles` + auto-create trigger on `auth.users` |
| `0002_subscriptions.sql` | `plan_tier` + `subscription_status` enums, `subscriptions` |
| `0003_streams.sql` | `stream_kind` + `stream_status` enums, `streams`, `stream_events` |
| `0004_sessions.sql` | `sessions`, `session_metrics` |

All user-facing tables have RLS enabled with owner-only read policies. Writes
that originate from server-only contexts (Stripe webhooks, the edge VM, cron
jobs) use the service-role client (`src/lib/supabase/service.ts`) which
bypasses RLS — never expose that key to the browser.

## V1.5+ migrations

Reserved numbers (do not reuse):

- `0005_orgs.sql` (V1.5 — Career Services orgs)
- `0006_reports.sql` (V1.5 — MBIS reports)
- `0007_outbound_webhooks.sql` (V1.5 — Enterprise webhooks)
- `0008_history_snapshots.sql` (V1.5 — daily aggregations)
- `0009_pgvector.sql` (V1.5 — extension only, columns reserved for V2)
