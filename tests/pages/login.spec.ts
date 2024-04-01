import { test, expect } from '@playwright/test';

import { VALID_ADMIN_USERNAME, ADMIN_STORAGE_STATE } from '../helpers';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/);
  });

  test('should display login form elements', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();

    const usernameInput = page.getByPlaceholder('Your username');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await expect(usernameInput).toHaveAttribute('type', 'text');
    await expect(submitButton).toHaveAttribute('type', 'submit');

    await expect(usernameInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(VALID_ADMIN_USERNAME);
    await submitButton.click();

    await expect(page.locator('.drawer').getByText(VALID_ADMIN_USERNAME)).toBeVisible();
  });

  test('should not login with empty fields', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill('');
    await submitButton.click();

    await expect(page).toHaveURL(
      '/login?redirectTo=http%3A%2F%2Flocalhost%3A3333%2Fhome'
    );

    await expect(page.getByText('Username is required').first()).toBeVisible();
  });

  test.describe('Logout', () => {
    test.use({ storageState: ADMIN_STORAGE_STATE });

    test('should successfully logout', async ({ page }) => {
      const logoutOption = page.getByRole('button', { name: 'Logout' });
      await logoutOption.click();

      const logoutModal = page.locator('dialog[open]');
      await expect(logoutModal.locator('h3')).toHaveText('Logout');
      await expect(logoutModal.locator('p')).toHaveText(
        'Are you sure you want to log out? You will be redirected to the login page.'
      );

      const logoutButton = logoutModal.getByRole('button', { name: 'Logout' });
      await logoutButton.click();

      await expect(page).toHaveURL(
        '/login?redirectTo=http%3A%2F%2Flocalhost%3A3333%2Fhome'
      );
    });
  });
});
