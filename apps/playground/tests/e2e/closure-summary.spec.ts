import { test, expect } from '@playwright/test';

// This is a stub. Replace selectors and data setup with real app logic as needed.
test.describe('Session closure summary E2E', () => {
  test('completes a session and sees summary', async ({ page }) => {
    // Simulate session completion and navigation to closure screen
    await page.goto('/playground/rehearse/session-complete-fixture');
    await expect(page.getByTestId('session-summary')).toBeVisible();
    await expect(page.getByText(/Duration:/)).toBeVisible();
    await expect(page.getByText(/We observed:/)).toBeVisible();
  });

  test('aborted session shows abort line', async ({ page }) => {
    await page.goto('/playground/rehearse/session-aborted-fixture');
    await expect(page.getByText(/Session ended early/)).toBeVisible();
  });

  test('history revisit renders same summary', async ({ page }) => {
    await page.goto('/playground/history/session-complete-fixture');
    const summary = await page.getByTestId('session-summary').textContent();
    await page.goto('/playground/rehearse/session-complete-fixture');
    const summary2 = await page.getByTestId('session-summary').textContent();
    expect(summary).toBe(summary2);
  });
});
