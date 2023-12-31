import { faker } from '@faker-js/faker';

import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  VALID_PASSWORD,
} from '../helpers';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';

import { PAGE_SIZE } from '~/config/constants.server';

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
    let name: string | null;
    let username: string | null;

    test.beforeAll(async () => {
      [{ name, username }] = await db
        .select({ name: usersTable.name, username: usersTable.username })
        .from(usersTable)
        .offset(PAGE_SIZE * 2)
        .limit(1);
    });

    test('should filter by name', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search users...');

      await searchBar.fill(name!);
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(2);

      const user = page.getByRole('row').nth(1);
      await expect(user.getByRole('cell').first().locator('p')).toHaveText(name!);
    });

    test('should filter by username', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search users...');

      await searchBar.fill(username!);
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(2);
      const user = page.getByRole('row').nth(1);
      await expect(user.getByRole('cell').nth(1)).toHaveText(username!);
    });
  });

  test.describe('Create User', () => {
    test.beforeEach(async ({ page }) => {
      const createUserButton = page.getByRole('link', { name: 'Create User' });
      await createUserButton.click();
    });

    test('should create a new user', async ({ page }) => {
      const name = faker.person.fullName();
      const username = faker.lorem.word();
      const password = VALID_PASSWORD;

      const nameInput = page.getByLabel('Name', { exact: true });
      const usernameInput = page.getByLabel('Username');
      const passwordInput = page.getByLabel('Password');
      const submitButton = page.getByRole('button', { name: 'Save' });

      await nameInput.fill(name);
      await usernameInput.fill(username);
      await passwordInput.fill(password);

      await submitButton.click();

      await expect(page).toHaveURL('/users');

      const user = page.getByRole('row').nth(1);
      await expect(user.getByRole('cell').first().locator('p')).toHaveText(name);
      await expect(user.getByRole('cell').nth(1)).toHaveText(username);
    });

    test('should throw error message - empty name', async ({ page }) => {
      const nameInput = page.getByLabel('Name', { exact: true });
      await nameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Name is required')).toBeVisible();
    });

    test('should throw error message - empty username', async ({ page }) => {
      const usernameInput = page.getByLabel('Username');
      await usernameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Username is required')).toBeVisible();
    });

    test('should throw error message - empty password', async ({ page }) => {
      const usernameInput = page.getByLabel('Password');
      await usernameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Password is required')).toBeVisible();
    });
  });

  test.describe('Edit User', () => {
    let name: string | null;
    let username: string | null;
    let editUserUrl: string | null;

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      const user = page.getByRole('row').nth(USER_ROW);
      const editUserButton = user.locator('a');

      name = await user.getByRole('cell').first().locator('p').textContent();
      username = await user.getByRole('cell').nth(1).textContent();

      editUserUrl = await editUserButton.getAttribute('href');

      await editUserButton.click();

      const nameInput = page.getByLabel('Name', { exact: true });
      const usernameInput = page.getByLabel('Username');

      await expect(nameInput).toHaveValue(name!);
      await expect(usernameInput).toHaveValue(username!);
    });

    test('should edit Name', async ({ page }) => {
      const newName = 'New Name';

      const nameInput = page.getByLabel('Name', { exact: true });
      await nameInput.fill(newName);

      const submitButton = page.getByRole('button', { name: 'Edit User' });
      await submitButton.click();

      await expect(page).toHaveURL('/users');
      await page.waitForLoadState('networkidle');

      const user = page.getByRole('row').nth(USER_ROW);
      await expect(user.getByRole('cell').first().locator('p')).toHaveText(newName);

      // restore previous name
      await page.goto(editUserUrl!);
      await nameInput.fill(name!);
      await submitButton.click();
    });

    test('should edit Username', async ({ page }) => {
      const newUsername = 'New Username';

      const usernameInput = page.getByLabel('Username');
      await usernameInput.fill(newUsername);

      const submitButton = page.getByRole('button', { name: 'Edit User' });
      await submitButton.click();

      await expect(page).toHaveURL('/users');

      const user = page.getByRole('row').nth(USER_ROW);
      await expect(user.getByRole('cell').nth(1)).toHaveText(newUsername);

      // restore previous username
      await page.goto(editUserUrl!);
      await usernameInput.fill(username!);
      await submitButton.click();
    });

    test('should not be able to edit Choose Role - same role', async ({ page }) => {
      const roleSelectInput = page.getByLabel('Choose Role');
      await expect(roleSelectInput).toBeDisabled();
    });

    test('should not be able to edit Password', async ({ page }) => {
      const passwordInput = page.getByLabel('Password');
      await expect(passwordInput).not.toBeVisible();
    });

    test('should throw error message - empty name', async ({ page }) => {
      const nameInput = page.getByLabel('Name', { exact: true });
      await nameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit User' });
      await submitButton.click();

      await expect(page.getByText('Name is required')).toBeVisible();
    });

    test('should throw error message - empty username', async ({ page }) => {
      const usernameInput = page.getByLabel('Username');
      await usernameInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit User' });
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
      const name = await user.getByRole('cell').first().textContent();
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

  test('should not be visible and redirect to Home page', async ({ page }) => {
    await expect(page).toHaveURL('/assignments');
  });
});

test.describe('Users page - Student', () => {
  test.use({ storageState: STUDENT_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/users');
  });

  test('should not be visible and redirect to Home page', async ({ page }) => {
    await expect(page).toHaveURL('/home');
  });
});
