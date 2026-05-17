import { test, expect } from '@playwright/test';

test.describe('Nurse Rehearse End-to-End', () => {
  test('nurse can complete full closure workflow', async ({ page }) => {
    await page.goto('/rehearse-nurse');
    await expect(page.getByText(/Nurse Rehearse/)).toBeVisible();
    for (let i = 0; i < 5; i++) {
      const btn = page.getByRole('button', { name: /Complete Step/ });
      await btn.click();
      await expect(btn).not.toBeDisabled();
    }
    await expect(page.getByText(/Session Complete/)).toBeVisible();
    await expect(page.getByText(/Verdict:/)).toBeVisible();
    await expect(page.getByText(/All steps completed/)).toBeVisible();
  });

  test('handles API failure gracefully', async ({ page }) => {
    // Simulate API failure by intercepting requests (if supported in your setup)
    // This is a placeholder for advanced E2E error handling
    await page.goto('/rehearse-nurse');
    // ...simulate error and check for error message
  });
});
