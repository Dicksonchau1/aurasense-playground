# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MissionCoreShell.spec.ts >> MissionCoreShell >> renders MissionFenceSection
- Location: apps/atlas/src/pages/__tests__/MissionCoreShell.spec.ts:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/MissionCoreShell", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // MissionCoreShell UI smoke test
  4  | // Assumes dev server is running at http://localhost:3000
  5  | 
  6  | test.describe('MissionCoreShell', () => {
  7  |   test('renders MissionFenceSection', async ({ page }) => {
> 8  |     await page.goto('http://localhost:3000/MissionCoreShell');
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  9  |     await expect(page.getByText('Mission fence')).toBeVisible();
  10 |     await expect(page.getByText('Boundary enforcement visibility')).toBeVisible();
  11 |   });
  12 | });
  13 | 
```