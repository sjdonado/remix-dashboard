import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  getUserSession,
} from '../helpers';
import type { UserSession } from '~/schemas/user';

test.describe('Me page - Admin', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  let userSession: UserSession;

  test.beforeEach(async ({ page, context }) => {
    const cookies = await context.cookies();
    userSession = await getUserSession(cookies);

    await page.goto('/me');
  });

  test('should has page title', async ({ page }) => {
    const title = page.locator('nav a[aria-current=true]');

    await expect(title).toHaveText('My Profile');
    await expect(page).toHaveURL('/me');
  });

  test('should have profile details', async ({ page }) => {
    const username = page.getByPlaceholder('Your username');
    const role = page.getByText(userSession.role);

    await expect(username).toHaveValue(userSession.username);
    await expect(role).toBeVisible();
  });

  test('should update profile - name', async ({ page }) => {
    const newUsername = 'John';

    const nameInput = page.getByPlaceholder('Your name');
    await nameInput.fill(newUsername);

    const submitButton = page.getByRole('button', { name: 'Save' });
    await submitButton.click();

    await expect(nameInput).toHaveValue(newUsername);

    // restore previous name
    await nameInput.fill(userSession.username);
    await submitButton.click();
  });

  test('should update profile - username', async ({ page }) => {
    const newUsername = 'johnuser';

    const nameInput = page.getByPlaceholder('Your username');
    await nameInput.fill(newUsername);

    const submitButton = page.getByRole('button', { name: 'Save' });
    await submitButton.click();

    await expect(nameInput).toHaveValue(newUsername);

    // restore previous username
    await nameInput.fill(userSession.username);
    await submitButton.click();
  });

  test('should go back to previous page', async ({ page }) => {
    const backButton = page.getByRole('button', { name: 'Back' });
    await backButton.click();

    await expect(page).toHaveURL('/home');
  });

  test('should show error message - empty name', async ({ page }) => {
    const nameInput = page.getByPlaceholder('Your name');
    await nameInput.fill('');

    const submitButton = page.getByRole('button', { name: 'Save' });
    await submitButton.click();

    await expect(page.getByText('Name is required')).toBeVisible();
  });

  test('should show error message - empty username', async ({ page }) => {
    const nameInput = page.getByPlaceholder('Your username');
    await nameInput.fill('');

    const submitButton = page.getByRole('button', { name: 'Save' });
    await submitButton.click();

    await expect(page.getByText('Username is required')).toBeVisible();
  });
});

test.describe('Me page - Teacher', () => {
  test.use({ storageState: TEACHER_STORAGE_STATE });

  let userSession: UserSession;

  test.beforeEach(async ({ page, context }) => {
    const cookies = await context.cookies();
    userSession = await getUserSession(cookies);

    await page.goto('/me');
  });

  test('should has page title', async ({ page }) => {
    const title = page.locator('nav a[aria-current=true]');

    await expect(title).toHaveText('My Profile');
    await expect(page).toHaveURL('/me');
  });

  test('should have profile details', async ({ page }) => {
    const username = page.getByPlaceholder('Your username');
    const role = page.getByText(userSession.role);

    await expect(username).toHaveValue(userSession.username);
    await expect(role).toBeVisible();
  });
});

test.describe('Me page - Student', () => {
  test.use({ storageState: STUDENT_STORAGE_STATE });

  let userSession: UserSession;

  test.beforeEach(async ({ page, context }) => {
    const cookies = await context.cookies();
    userSession = await getUserSession(cookies);

    await page.goto('/me');
  });

  test('should has page title', async ({ page }) => {
    const title = page.locator('nav a[aria-current=true]');

    await expect(title).toHaveText('My Profile');
    await expect(page).toHaveURL('/me');
  });

  test('should have profile details', async ({ page }) => {
    const username = page.getByPlaceholder('Your username');
    const role = page.getByText(userSession.role);

    await expect(username).toHaveValue(userSession.username);
    await expect(role).toBeVisible();
  });
});
