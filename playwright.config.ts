import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // globalSetup: require.resolve('./tests/global-setup'),
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3333',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3333,
    env: {
      NODE_ENV: 'test',
      SESSION_SECRET: 'secret_123456',
      DATABASE_URL: 'db.sqlite',
    },
    reuseExistingServer: !process.env.CI,
  },
});
