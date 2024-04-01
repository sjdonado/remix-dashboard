import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
} from '../helpers';

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
    await expect(page.locator('#assignments h1')).toHaveCount(10);
  });

  test('should have pagination', async ({ page }) => {
    await expect(page.locator('a[href*="/home?page=3"]')).toBeVisible();
    await expect(page.locator('a[href*="/home?page=72"]')).toBeVisible();
  });

  test('should paginate assignments', async ({ page }) => {
    await expect(page.locator('#assignments h1')).toHaveCount(10);
    const firstAssignment = await page.locator('#assignments h1').first().textContent();

    await expect(page.locator('a[href*="/home?page=2"]').first()).toBeVisible();

    await page.locator('#pagination-next').click();
    await page.waitForURL('/home?page=2');

    await expect(page.locator('#assignments h1')).toHaveCount(10);
    await expect(page.locator('#assignments h1').first()).not.toHaveText(
      firstAssignment!
    );
  });

  test('should go to assignment details page', async ({ page }) => {
    const assignmentLink = page.locator('#assignments a').first();
    const assignmentTitle = await assignmentLink.innerText();
    const assignmentUrl = await assignmentLink.getAttribute('href');

    await assignmentLink.click();

    await expect(page).toHaveURL(assignmentUrl!);
    await expect(page.locator('h1')).toHaveText(assignmentTitle);
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
    await expect(page.locator('#assignments h1')).toHaveCount(10);
  });

  test('should have pagination', async ({ page }) => {
    await expect(page.locator('a[href*="/home?page=3"]')).toBeVisible();
    await expect(page.locator('a[href*="/home?page=72"]')).toBeVisible();
  });

  test('should paginate assignments', async ({ page }) => {
    await expect(page.locator('#assignments h1')).toHaveCount(10);
    const firstAssignment = await page.locator('#assignments h1').first().textContent();

    await expect(page.locator('a[href*="/home?page=2"]').first()).toBeVisible();

    await page.locator('#pagination-next').click();
    await page.waitForURL('/home?page=2');

    await expect(page.locator('#assignments h1')).toHaveCount(10);
    await expect(page.locator('#assignments h1').first()).not.toHaveText(
      firstAssignment!
    );
  });
});
