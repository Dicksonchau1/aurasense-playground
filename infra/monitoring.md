# Monitoring Setup for AuraSense Playground

## Application Insights (Azure)
- Add Application Insights SDK to Next.js app for telemetry.
- Configure instrumentation key via environment variable.
- Track page views, API calls, and custom events.

## Sentry (Alternative/Complementary)
- Add Sentry SDK for error tracking.
- Configure DSN via environment variable.
- Capture unhandled exceptions and performance metrics.

## Steps
1. Choose monitoring provider (App Insights, Sentry, or both).
2. Add SDK to `apps/playground` (see below for code snippets).
3. Set environment variables in Vercel/Hostinger and locally.
4. Validate telemetry in provider dashboard after deployment.

---

## Example: Sentry Integration (Next.js)

1. Install:
   ```sh
   pnpm add @sentry/nextjs
   ```
2. Add `SENTRY_DSN` to `.env`:
   ```env
   SENTRY_DSN=your_sentry_dsn_here
   ```
3. Initialize Sentry in `apps/playground/sentry.client.config.ts` and `sentry.server.config.ts`.

## Example: Application Insights (Node.js/Browser)

1. Install:
   ```sh
   pnpm add applicationinsights
   ```
2. Add `APPINSIGHTS_CONNECTION_STRING` to `.env`:
   ```env
   APPINSIGHTS_CONNECTION_STRING=your_connection_string_here
   ```
3. Initialize in a top-level file (e.g., `src/utils/monitoring.ts`).
