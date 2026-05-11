import { test, expect } from '@playwright/test';

test.describe('Audit Page', () => {
  test('should render audit events and AuditLive', async ({ page }) => {
    await page.goto('/audit');
    // Check for the Audit Chain heading
    await expect(page.getByRole('heading', { name: /Audit Chain/i })).toBeVisible();
    // Check for at least one event row (if backend returns events)
    const eventRows = page.locator('div.rounded.border');
    await expect(eventRows.first()).toBeVisible();
    // Check for Q: and A: labels in HRI events (if present)
    await expect(page.locator('div:has-text("Q:")')).toBeVisible();
    await expect(page.locator('div:has-text("A:")')).toBeVisible();
  });
});
