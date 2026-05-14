import { test, expect } from '@playwright/test';

// FlightStackShell UI smoke test
// Assumes dev server is running at http://localhost:3000

test.describe('FlightStackShell', () => {
  test('renders RecoveryActionsSection', async ({ page }) => {
    await page.goto('http://localhost:3000/FlightStackShell');
    await expect(page.getByText('Recovery actions')).toBeVisible();
    await expect(page.getByText('Last-resort operator intervention')).toBeVisible();
  });
});
