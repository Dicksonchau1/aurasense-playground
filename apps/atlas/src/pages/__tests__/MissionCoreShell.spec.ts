import { test, expect } from '@playwright/test';

// MissionCoreShell UI smoke test
// Assumes dev server is running at http://localhost:3000

test.describe('MissionCoreShell', () => {
  test('renders MissionFenceSection', async ({ page }) => {
    await page.goto('http://localhost:3000/MissionCoreShell');
    await expect(page.getByText('Mission fence')).toBeVisible();
    await expect(page.getByText('Boundary enforcement visibility')).toBeVisible();
  });
});
