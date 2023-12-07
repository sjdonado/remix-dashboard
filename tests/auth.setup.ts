import { test as setup, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  VALID_ADMIN_USERNAME,
  VALID_TEACHER_USERNAME,
  mockUserSession,
} from './helpers';

const COOKIES_DEFAULTS = {
  name: '__session',
  domain: '127.0.0.1',
  path: '/',
  sameSite: 'Lax' as const,
  httpOnly: true,
  expires: Date.now() / 1000 + 3600,
};

setup('authenticate as admin', async ({ page, context }) => {
  const mockedSession = await mockUserSession(VALID_ADMIN_USERNAME);

  await context.addCookies([
    {
      ...COOKIES_DEFAULTS,
      value: mockedSession,
    },
  ]);

  await page.goto('/');
  await expect(page.locator('.dropdown').getByText(VALID_ADMIN_USERNAME)).toBeVisible();

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});

setup('authenticate as teacher', async ({ page, context }) => {
  const mockedSession = await mockUserSession(VALID_TEACHER_USERNAME);

  await context.addCookies([
    {
      ...COOKIES_DEFAULTS,
      value: mockedSession,
    },
  ]);

  await page.goto('/');
  await expect(page.locator('.dropdown').getByText(VALID_TEACHER_USERNAME)).toBeVisible();

  await page.context().storageState({ path: TEACHER_STORAGE_STATE });
});

setup('authenticate as student', async ({ page, context }) => {
  const mockedSession = await mockUserSession(VALID_TEACHER_USERNAME);

  await context.addCookies([
    {
      ...COOKIES_DEFAULTS,
      value: mockedSession,
    },
  ]);

  await page.goto('/');
  await expect(page.locator('.dropdown').getByText(VALID_TEACHER_USERNAME)).toBeVisible();

  await page.context().storageState({ path: STUDENT_STORAGE_STATE });
});
