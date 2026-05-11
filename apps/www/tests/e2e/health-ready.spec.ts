import { test, expect } from "@playwright/test";

test("health and ready endpoints", async ({ request }) => {
  const health = await request.get("/api/nepa/runtime/health");
  expect(health.status()).toBe(200);
  expect((await health.json()).ok).toBe(true);

  const ready = await request.get("/api/nepa/runtime/ready");
  expect([200, 503]).toContain(ready.status());
  expect(typeof (await ready.json()).ok).toBe("boolean");
});
