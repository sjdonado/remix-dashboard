import { faker } from '@faker-js/faker';

import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
} from '../helpers';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';

import { PAGE_SIZE } from '~/constants/search.server';

test.describe('Users page - Admin', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  const USER_ROW = 1;
  const TABLE_ROWS_LENGTH = PAGE_SIZE + 1;

  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test.describe('List Users', () => {
    test('should has page name', async ({ page }) => {
      const name = page.locator('nav a[aria-current=true]');

      await expect(name).toHaveText('Users');
      await expect(page).toHaveURL('/users');
    });

    test('should have a list of users', async ({ page }) => {
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
    });

    test('should have pagination', async ({ page }) => {
      await expect(page.locator('a[href*="/users?page=3"]')).toBeVisible();
      await expect(page.locator('a[href*="/users?page=6"]')).toBeVisible();
    });

    test('should paginate users', async ({ page }) => {
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
      const firstUserName = await page
        .getByRole('row')
        .nth(1)
        .getByRole('cell')
        .first()
        .textContent();

      await expect(page.locator('a[href*="/users?page=2"]').first()).toBeVisible();

      await page.locator('#pagination-next').click();
      await page.waitForURL('/users?page=2');

      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
      await expect(page.getByRole('row').nth(1).getByRole('cell').first()).not.toHaveText(
        firstUserName!
      );
    });
  });

  test.describe('Search Users', () => {
    let username: string | null;

    test.beforeAll(async () => {
      [{ username }] = await db
        .select({ username: usersTable.username })
        .from(usersTable)
        .offset(PAGE_SIZE * 2)
        .limit(1);
    });

    test('should filter by username', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search users...');

      await searchBar.fill(username!);
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(2);
      const user = page.getByRole('row').nth(1);
      await expect(user.getByRole('cell').first().getByRole('paragraph')).toHaveText(
        username!
      );
    });
  });

  test.describe('Create User', () => {
    test.beforeEach(async ({ page }) => {
      const createUserButton = page.getByRole('link', { name: 'New User' });
      await createUserButton.click();
    });

    test('should create a new user', async ({ page }) => {
      const username = faker.lorem.word();

      const usernameInput = page.getByLabel('Username');
      const submitButton = page.getByRole('button', { name: 'Save' });

      await usernameInput.fill(username);

      await submitButton.click();

      await expect(page).toHaveURL('/users');

      const user = page.getByRole('row').nth(1);
      await expect(user.getByRole('cell').first().getByRole('paragraph')).toHaveText(
        username
      );
    });

    test('should throw error message - empty username', async ({ page }) => {
      const usernameInput = page.getByLabel('Username');
      await usernameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Username is required')).toBeVisible();
    });
  });

  test.describe('Edit User', () => {
    let username: string | null;
    let editUserUrl: string | null;

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      const user = page.getByRole('row').nth(USER_ROW);
      const editUserButton = user.locator('a');

      username = await user
        .getByRole('cell')
        .first()
        .getByRole('paragraph')
        .textContent();

      editUserUrl = await editUserButton.getAttribute('href');
      await editUserButton.click();

      const usernameInput = page.getByLabel('Username');
      await expect(usernameInput).toHaveValue(username!);
    });

    test('should edit Username', async ({ page }) => {
      const newUsername = 'New Username';

      const usernameInput = page.getByLabel('Username');
      await usernameInput.fill(newUsername);

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      const user = page.getByRole('row').nth(USER_ROW);
      await expect(user.getByRole('cell').first().getByRole('paragraph')).toHaveText(
        newUsername
      );

      // restore previous username
      await page.goto(editUserUrl!);
      await usernameInput.fill(username!);
      await submitButton.click();
    });

    test('should throw error message - empty username', async ({ page }) => {
      const usernameInput = page.getByLabel('Username');
      await usernameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Username is required')).toBeVisible();
    });
  });

  test.describe('Delete User', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/users?page=2');
      await page.waitForLoadState('networkidle');
    });

    test('should successfully delete user', async ({ page }) => {
      const user = page.getByRole('row').nth(USER_ROW);
      const name = await user
        .getByRole('cell')
        .first()
        .getByRole('paragraph')
        .textContent();

      const deleteUserButton = user.getByRole('button');
      await deleteUserButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const deleteButton = deleteModal.getByRole('button', { name: 'Delete' });
      await deleteButton.click();

      await expect(page).toHaveURL('/users?page=2');
      await expect(page.getByText(name!).nth(1)).not.toBeVisible();
    });

    test('should go back from delete confirmation modal', async ({ page }) => {
      const user = page.getByRole('row').nth(USER_ROW);
      const name = await user.getByRole('cell').first().textContent();

      const deleteUserButton = user.getByRole('button');
      await deleteUserButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const cancelButton = deleteModal.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      await expect(page).toHaveURL('/users?page=2');
      await expect(page.getByText(name!).nth(1)).toBeVisible();
    });
  });
});

test.describe('Users page - Teacher', () => {
  test.use({ storageState: TEACHER_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('should not be visible', async ({ page }) => {
    await expect(page).toHaveURL('/unauthorized');
  });
});

test.describe('Users page - Student', () => {
  test.use({ storageState: STUDENT_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('should not be visible', async ({ page }) => {
    await expect(page).toHaveURL('/unauthorized');
  });
});
