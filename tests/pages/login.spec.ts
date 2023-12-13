import { test, expect } from '@playwright/test';

import { VALID_PASSWORD, VALID_ADMIN_USERNAME, ADMIN_STORAGE_STATE } from '../helpers';

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
    const passwordInput = page.getByPlaceholder('Your password');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await expect(usernameInput).toHaveAttribute('type', 'text');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(submitButton).toHaveAttribute('type', 'submit');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const passwordInput = page.getByPlaceholder('Your password');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(VALID_ADMIN_USERNAME);
    await passwordInput.fill(VALID_PASSWORD);
    await submitButton.click();

    await expect(page.locator('.dropdown').getByText(VALID_ADMIN_USERNAME)).toBeVisible();
  });

  test('should not login with invalid credentials', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const passwordInput = page.getByPlaceholder('Your password');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(VALID_ADMIN_USERNAME);
    await passwordInput.fill('111111');
    await submitButton.click();

    await expect(page).toHaveURL('/login');

    await expect(page.getByText('Invalid username or password').first()).toBeVisible();
  });

  test('should not login with empty username', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const passwordInput = page.getByPlaceholder('Your password');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill('');
    await passwordInput.fill(VALID_PASSWORD);
    await submitButton.click();

    await expect(page).toHaveURL('/login');

    await expect(page.getByText('Username is required')).toBeVisible();
  });

  test('should not login with empty password', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const passwordInput = page.getByPlaceholder('Your password');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(VALID_ADMIN_USERNAME);
    await passwordInput.fill('');
    await submitButton.click();

    await expect(page).toHaveURL('/login');

    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should not login with invalid password', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Your username');
    const passwordInput = page.getByPlaceholder('Your password');
    const submitButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(VALID_ADMIN_USERNAME);
    await passwordInput.fill('1');
    await submitButton.click();

    await expect(page).toHaveURL('/login');

    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });

  test.describe('Logout', () => {
    test.use({ storageState: ADMIN_STORAGE_STATE });

    test('should successfully logout', async ({ page }) => {
      const dropdown = page.locator('.dropdown');
      await expect(dropdown.locator('label')).toHaveText(VALID_ADMIN_USERNAME);

      await dropdown.click();

      const logoutOption = dropdown.getByRole('button', { name: 'Logout' });
      await logoutOption.click();

      const logoutModal = page.locator('dialog[open]');
      await expect(logoutModal.locator('h3')).toHaveText('Logout');
      await expect(logoutModal.locator('p')).toHaveText(
        'Are you sure you want to log out? You will be redirected to the login page.'
      );

      const logoutButton = logoutModal.getByRole('button', { name: 'Logout' });
      await logoutButton.click();

      await expect(page).toHaveURL('/login');
    });
  });
});
