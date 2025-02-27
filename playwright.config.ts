import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 100000,

  fullyParallel: false,
  workers: 1,  // Tek worker devam


  forbidOnly: !!process.env.CI,


  retries: process.env.CI ? 2 : 0,


  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
