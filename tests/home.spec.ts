import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
} from './helpers';

test.describe('Home page - Admin', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
  });

  test('should has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page).toHaveURL('/home');
  });

  test('should have a list of assignments', async ({ page }) => {
    await expect(page.locator('#assignments p')).toHaveCount(10);
  });

  test('should have pagination', async ({ page }) => {
    await expect(page.locator('a[href*="/home?page=3"]')).toBeVisible();
    await expect(page.locator('a[href*="/home?page=60"]')).toBeVisible();
  });

  test('should paginate assignments', async ({ page }) => {
    await expect(page.locator('#assignments p')).toHaveCount(10);
    const firstAssignment = await page.locator('#assignments p').first().textContent();

    await page.locator('a[href*="/home?page=2"]').first().click();
    await page.waitForURL('/home?page=2');

    await expect(page.locator('#assignments p')).toHaveCount(10);
    const secondAssignment = await page.locator('#assignments p').first().textContent();

    expect(firstAssignment).not.toBe(secondAssignment);
  });
});

test.describe('Home page should not be visible - Teacher', () => {
  test.use({ storageState: TEACHER_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
  });

  test('should redirect to Assignments page', async ({ page }) => {
    await expect(page).toHaveURL('/assignments');
  });
});

test.describe('Home page - Student', () => {
  test.use({ storageState: STUDENT_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
  });

  test('should has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page).toHaveURL('/home');
  });

  test('should have a list of assignments', async ({ page }) => {
    await expect(page.locator('#assignments p')).toHaveCount(10);
  });

  test('should have pagination', async ({ page }) => {
    await expect(page.locator('a[href*="/home?page=3"]')).toBeVisible();
    await expect(page.locator('a[href*="/home?page=60"]')).toBeVisible();
  });

  test('should paginate assignments', async ({ page }) => {
    await expect(page.locator('#assignments p')).toHaveCount(10);
    const firstAssignment = await page.locator('#assignments p').first().textContent();

    await page.locator('a[href*="/home?page=2"]').first().click();
    await page.waitForURL('/home?page=2');

    await expect(page.locator('#assignments p')).toHaveCount(10);
    const secondAssignment = await page.locator('#assignments p').first().textContent();

    expect(firstAssignment).not.toBe(secondAssignment);
  });
});
