import { test, expect } from "@playwright/test";

test("HRI popup renders and acknowledges", async ({ page }) => {
  await page.route("**/api/nepa/v1/hri/stream**", (route) =>
    route.fulfill({
      contentType: "text/event-stream",
      body: `data: ${JSON.stringify({
        request_id: "01J_TEST",
        session_id: "s1",
        surface: "rehearse-nurse",
        trigger: "low_confidence",
        question: "Was that a complete WHO step 3?",
        options: ["Yes", "No, re-soap"],
        free_text_allowed: true,
        context: {},
        expires_at: new Date(Date.now() + 60000).toISOString(),
        fallback_action: "auto_pass",
      })}\n\n`,
    }),
  );
  await page.route("**/api/nepa/v1/hri/respond", (route) =>
    route.fulfill({ status: 200, body: '{"status":"ok"}' }),
  );
  await page.goto("/");
  await expect(page.getByText(/WHO step 3/)).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(page.getByText(/WHO step 3/)).not.toBeVisible();
});
