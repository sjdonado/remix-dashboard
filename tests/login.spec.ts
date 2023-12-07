import { test, expect } from '@playwright/test';

import { VALID_PASSWORD, VALID_ADMIN_USERNAME } from './helpers';

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
