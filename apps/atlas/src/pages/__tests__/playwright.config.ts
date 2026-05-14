import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/atlas/src/pages/__tests__',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
});
