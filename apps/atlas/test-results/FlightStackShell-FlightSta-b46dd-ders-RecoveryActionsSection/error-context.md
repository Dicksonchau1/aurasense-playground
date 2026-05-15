# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: FlightStackShell.spec.ts >> FlightStackShell >> renders RecoveryActionsSection
- Location: apps/atlas/src/pages/__tests__/FlightStackShell.spec.ts:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/FlightStackShell
Call log:
  - navigating to "http://localhost:3000/FlightStackShell", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // FlightStackShell UI smoke test
  4  | // Assumes dev server is running at http://localhost:3000
  5  | 
  6  | test.describe('FlightStackShell', () => {
  7  |   test('renders RecoveryActionsSection', async ({ page }) => {
> 8  |     await page.goto('http://localhost:3000/FlightStackShell');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/FlightStackShell
  9  |     await expect(page.getByText('Recovery actions')).toBeVisible();
  10 |     await expect(page.getByText('Last-resort operator intervention')).toBeVisible();
  11 |   });
  12 | });
  13 | 
```