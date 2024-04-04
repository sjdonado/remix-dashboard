import dotenv from 'dotenv';

import { defineConfig, devices } from '@playwright/test';

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3333;

dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://${host}:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup db',
      testMatch: /db\.setup\.ts/,
    },
    { name: 'setup auth', testMatch: /auth\.setup\.ts/, dependencies: ['setup db'] },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup auth'],
    },
  ],
  webServer: {
    command: 'NODE_ENV=test bun run dev',
    port: Number(port),
    reuseExistingServer: !process.env.CI,
  },
});
