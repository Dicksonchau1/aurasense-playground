# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps/www/tests/e2e/audit.spec.ts >> Audit Page >> should render audit events and AuditLive
- Location: apps/www/tests/e2e/audit.spec.ts:4:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/audit", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Audit Page', () => {
  4  |   test('should render audit events and AuditLive', async ({ page }) => {
> 5  |     await page.goto('/audit');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  6  |     // Check for the Audit Chain heading
  7  |     await expect(page.getByRole('heading', { name: /Audit Chain/i })).toBeVisible();
  8  |     // Check for at least one event row (if backend returns events)
  9  |     const eventRows = page.locator('div.rounded.border');
  10 |     await expect(eventRows.first()).toBeVisible();
  11 |     // Check for Q: and A: labels in HRI events (if present)
  12 |     await expect(page.locator('div:has-text("Q:")')).toBeVisible();
  13 |     await expect(page.locator('div:has-text("A:")')).toBeVisible();
  14 |   });
  15 | });
  16 | 
```