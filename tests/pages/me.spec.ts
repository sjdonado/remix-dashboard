import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  VALID_ADMIN_USERNAME,
  VALID_STUDENT_USERNAME,
  VALID_TEACHER_USERNAME,
} from '../helpers';

import { userRoles } from '~/db/schema';

test.describe('Me page - Admin', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/me');
  });

  test('should has page title', async ({ page }) => {
    const title = page.locator('nav a[aria-current=true]');

    await expect(title).toHaveText('My Profile');
    await expect(page).toHaveURL('/me');
  });

  test('should have profile details', async ({ page }) => {
    const name = page.getByPlaceholder('Your name');
    const username = page.getByPlaceholder('Your username');
    const role = page.getByText(userRoles[0]);

    await expect(name).toBeVisible();
    await expect(username).toBeVisible();
    await expect(role).toBeVisible();

    expect(await username.inputValue()).toBe(VALID_ADMIN_USERNAME);
  });

  test('should update profile - name', async ({ page }) => {
    const newUsername = 'John';

    const nameInput = page.getByPlaceholder('Your name');
    await nameInput.fill(newUsername);

    const submitButton = page.getByRole('button', { name: 'Save' });
    await submitButton.click();

    await expect(nameInput).toHaveValue(newUsername);
  });

  test('should update profile - username', async ({ page }) => {
    const newUsername = 'johnuser';

    const nameInput = page.getByPlaceholder('Your username');
    await nameInput.fill(newUsername);

    const submitButton = page.getByRole('button', { name: 'Save' });
    await submitButton.click();

    await expect(nameInput).toHaveValue(newUsername);

    // restore previous username
    await nameInput.fill(VALID_ADMIN_USERNAME);
    await submitButton.click();
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

  test.beforeEach(async ({ page }) => {
    await page.goto('/me');
  });

  test('should has page title', async ({ page }) => {
    const title = page.locator('nav a[aria-current=true]');

    await expect(title).toHaveText('My Profile');
    await expect(page).toHaveURL('/me');
  });

  test('should have profile details', async ({ page }) => {
    const name = page.getByPlaceholder('Your name');
    const username = page.getByPlaceholder('Your username');
    const role = page.getByText(userRoles[1]);

    await expect(name).toBeVisible();
    await expect(username).toBeVisible();
    await expect(role).toBeVisible();

    expect(await username.inputValue()).toBe(VALID_TEACHER_USERNAME);
  });
});

test.describe('Me page - Student', () => {
  test.use({ storageState: STUDENT_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/me');
  });

  test('should has page title', async ({ page }) => {
    const title = page.locator('nav a[aria-current=true]');

    await expect(title).toHaveText('My Profile');
    await expect(page).toHaveURL('/me');
  });

  test('should have profile details', async ({ page }) => {
    const name = page.getByPlaceholder('Your name');
    const username = page.getByPlaceholder('Your username');
    const role = page.getByText(userRoles[2]);

    await expect(name).toBeVisible();
    await expect(username).toBeVisible();
    await expect(role).toBeVisible();

    expect(await username.inputValue()).toBe(VALID_STUDENT_USERNAME);
  });
});
