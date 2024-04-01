import { test as setup, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  VALID_ADMIN_USERNAME,
  VALID_STUDENT_USERNAME,
  VALID_TEACHER_USERNAME,
  mockUserSession,
} from './helpers';

import { UserRole } from '~/constants/user';

import { COOKIES_DEFAULTS } from '~/services/session.server';

setup('authenticate as admin', async ({ page, context }) => {
  const mockedSession = await mockUserSession(VALID_ADMIN_USERNAME);

  await context.addCookies([
    {
      ...COOKIES_DEFAULTS,
      value: mockedSession,
    },
  ]);

  await page.goto('/');
  await expect(page.locator('.badge').getByText(UserRole.Admin)).toBeVisible();

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
  await expect(page.locator('.badge').getByText(UserRole.Teacher)).toBeVisible();

  await page.context().storageState({ path: TEACHER_STORAGE_STATE });
});

setup('authenticate as student', async ({ page, context }) => {
  const mockedSession = await mockUserSession(VALID_STUDENT_USERNAME);

  await context.addCookies([
    {
      ...COOKIES_DEFAULTS,
      value: mockedSession,
    },
  ]);

  await page.goto('/');
  await expect(page.locator('.badge').getByText(UserRole.Student)).toBeVisible();

  await page.context().storageState({ path: STUDENT_STORAGE_STATE });
});
