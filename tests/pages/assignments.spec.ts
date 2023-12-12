import type { Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
} from '../helpers';

test.describe('Assignments page - Admin', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  const ASSIGNMENT_ROW = 1;
  const TABLE_ROWS = 11;

  test.beforeEach(async ({ page }) => {
    await page.goto('/assignments');
  });

  test.describe('List Assignments', () => {
    test('should has page title', async ({ page }) => {
      const title = page.locator('nav a[aria-current=true]');

      await expect(title).toHaveText('Assignments');
      await expect(page).toHaveURL('/assignments');
    });

    test('should have a list of assignments', async ({ page }) => {
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS);
    });

    test('should have pagination', async ({ page }) => {
      await expect(page.locator('a[href*="/assignments?page=3"]')).toBeVisible();
      await expect(page.locator('a[href*="/assignments?page=60"]')).toBeVisible();
    });

    test('should paginate assignments', async ({ page }) => {
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS);
      const firstAssignment = await page.getByRole('row').nth(1).textContent();

      await page.locator('a[href*="/assignments?page=2"]').first().click();
      await page.waitForURL('/assignments?page=2');

      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS);
      const secondAssignment = await page.getByRole('row').nth(1).textContent();

      expect(firstAssignment).not.toBe(secondAssignment);
    });
  });

  test.describe('Show Assignment', () => {
    test('should go to show assignment page', async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const showAssignmentButton = assignment.locator('a').first();

      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const assignmentAuthor = await assignment.getByRole('cell').nth(1).textContent();
      const assignmentCreatedAt = await assignment.getByRole('cell').nth(3).textContent();
      const showAssignmentUrl = await showAssignmentButton.getAttribute('href');

      await showAssignmentButton.click();

      await expect(page).toHaveURL(showAssignmentUrl!);
      await expect(page.locator('h1')).toHaveText(assignmentTitle!);
      await expect(page.getByText(assignmentAuthor!)).toBeVisible();
      await expect(page.getByText(assignmentCreatedAt!)).toBeVisible();
    });
  });

  test.describe('Edit Assignment', () => {
    let assignmentTitle: string | null;
    let assignmentAuthor: string | null;
    let editAssignmentUrl: string | null;

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const editAssignmentButton = assignment.locator('a').nth(1);

      assignmentTitle = await assignment.getByRole('cell').first().textContent();
      assignmentAuthor = await assignment
        .getByRole('cell')
        .nth(1)
        .locator('p')
        .textContent();

      editAssignmentUrl = await editAssignmentButton.getAttribute('href');

      await editAssignmentButton.click();

      const titleInput = page.getByLabel('Title');
      const authorInput = page.getByLabel('Author');

      await expect(titleInput).toHaveValue(assignmentTitle!);
      await expect(authorInput).toHaveValue(assignmentAuthor!);
    });

    test('should edit Title', async ({ page }) => {
      const newTitle = 'New Title';

      const assignmentTitleInput = page.getByPlaceholder('Title');
      await assignmentTitleInput.fill(newTitle);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await expect(
        page.getByRole('row').nth(ASSIGNMENT_ROW).getByRole('cell').first()
      ).toHaveText(newTitle);

      // restore previous title
      await page.goto(editAssignmentUrl!);
      await assignmentTitleInput.fill(assignmentTitle!);
      await submitButton.click();
    });

    test('should edit Content', async ({ page }) => {
      const newContent = 'New Content';

      const assignmentContentInput = page.getByPlaceholder('Content');
      await assignmentContentInput.fill(newContent);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await expect(
        page.getByRole('row').nth(ASSIGNMENT_ROW).getByRole('cell').nth(2)
      ).toHaveText(newContent);

      // restore previous content
      await page.goto(editAssignmentUrl!);
      await assignmentContentInput.fill(assignmentAuthor!);
      await submitButton.click();
    });

    test('should not be able to edit Author', async ({ page }) => {
      const assignmentAuthorSelectInput = page.getByLabel('Author');
      await expect(assignmentAuthorSelectInput).toBeDisabled();
    });

    test('should throw error message - empty title', async ({ page }) => {
      const assignmentTitleInput = page.getByPlaceholder('Title');
      await assignmentTitleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Title is required')).toBeVisible();
    });

    test('should throw error message - empty content', async ({ page }) => {
      const assignmentTitleInput = page.getByPlaceholder('Content');
      await assignmentTitleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Content is required')).toBeVisible();
    });
  });

  test.describe('Delete Assignment', () => {
    test.beforeEach(async ({ page }) => {
      await page.waitForLoadState('networkidle');
    });

    test('should successfully delete assignment', async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW + 4);
      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const deleteAssignmentButton = assignment.getByRole('button');

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');
      const formAction = await deleteModal
        .locator('form[method=get]')
        .getAttribute('action');

      const deleteButton = deleteModal.getByRole('button', { name: 'Delete' });
      await deleteButton.click();

      await expect(page).toHaveURL(formAction!);
      await expect(page.getByText(assignmentTitle!)).not.toBeVisible();
    });

    test('should go back from delete confirmation modal', async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW + 4);
      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const deleteAssignmentButton = assignment.getByRole('button');

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const cancelButton = deleteModal.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      await expect(page).toHaveURL('/assignments');
      await expect(page.getByText(assignmentTitle!).nth(1)).toBeVisible();
    });
  });
});

test.describe('Assignments page - Teacher', () => {
  test.use({ storageState: TEACHER_STORAGE_STATE });

  const ASSIGNMENT_ROW = 2;
  const TABLE_ROWS = 11;

  test.beforeEach(async ({ page }) => {
    await page.goto('/assignments');
  });

  test.describe('List Assignments', () => {
    test('should has page title', async ({ page }) => {
      const title = page.locator('nav a[aria-current=true]');

      await expect(title).toHaveText('Assignments');
      await expect(page).toHaveURL('/assignments');
    });

    test('should have a list of assignments', async ({ page }) => {
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS);
    });

    test('should have pagination - only one page', async ({ page }) => {
      await expect(page.locator('div').filter({ hasText: /^1$/ }).nth(0)).toBeVisible();
    });
  });

  test.describe('Show Assignment', () => {
    test('should go to show assignment page', async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const showAssignmentButton = assignment.locator('a').first();

      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const assignmentAuthor = await assignment.getByRole('cell').nth(1).textContent();
      const assignmentCreatedAt = await assignment.getByRole('cell').nth(3).textContent();
      const showAssignmentUrl = await showAssignmentButton.getAttribute('href');

      await showAssignmentButton.click();

      await expect(page).toHaveURL(showAssignmentUrl!);
      await expect(page.locator('h1')).toHaveText(assignmentTitle!);
      await expect(page.getByText(assignmentAuthor!)).toBeVisible();
      await expect(page.getByText(assignmentCreatedAt!)).toBeVisible();
    });

    test('should show only author assignments', async ({ page }) => {
      await page.goto('/me');
      const author = await page.getByPlaceholder('Your name').inputValue();

      await page.goto('/Assignments');

      const assignments = await page.getByRole('row').all();

      await Promise.all(
        assignments
          .slice(1)
          .map((assignment: Locator) =>
            expect(assignment.getByRole('cell').nth(1).locator('p')).toHaveText(author)
          )
      );
    });
  });

  test.describe('Edit Assignment', () => {
    let assignmentTitle: string | null;
    let assignmentAuthor: string | null;
    let editAssignmentUrl: string | null;

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const editAssignmentButton = assignment.locator('a').nth(1);

      assignmentTitle = await assignment.getByRole('cell').first().textContent();
      assignmentAuthor = await assignment
        .getByRole('cell')
        .nth(1)
        .locator('p')
        .textContent();
      editAssignmentUrl = await editAssignmentButton.getAttribute('href');

      await editAssignmentButton.click();

      const titleInput = page.getByLabel('Title');
      const authorInput = page.getByLabel('Author');

      await expect(titleInput).toHaveValue(assignmentTitle!);
      await expect(authorInput).toHaveValue(assignmentAuthor!);
    });

    test('should edit Title', async ({ page }) => {
      const newTitle = 'New Title';

      const assignmentTitleInput = page.getByPlaceholder('Title');
      await assignmentTitleInput.fill(newTitle);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await expect(
        page.getByRole('row').nth(ASSIGNMENT_ROW).getByRole('cell').first()
      ).toHaveText(newTitle);

      // restore previous title
      await page.goto(editAssignmentUrl!);
      await assignmentTitleInput.fill(assignmentTitle!);
      await submitButton.click();
    });

    test('should edit Content', async ({ page }) => {
      const newContent = 'New Content';

      const assignmentContentInput = page.getByPlaceholder('Content');
      await assignmentContentInput.fill(newContent);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await expect(
        page.getByRole('row').nth(ASSIGNMENT_ROW).getByRole('cell').nth(2)
      ).toHaveText(newContent);

      // restore previous content
      await page.goto(editAssignmentUrl!);
      await assignmentContentInput.fill(assignmentAuthor!);
      await submitButton.click();
    });

    test('should not be able to edit Author', async ({ page }) => {
      const assignmentAuthorSelectInput = page.getByLabel('Author');
      await expect(assignmentAuthorSelectInput).toBeDisabled();
    });

    test('should throw error message - empty title', async ({ page }) => {
      const assignmentTitleInput = page.getByPlaceholder('Title');
      await assignmentTitleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Title is required')).toBeVisible();
    });

    test('should throw error message - empty content', async ({ page }) => {
      const assignmentTitleInput = page.getByPlaceholder('Content');
      await assignmentTitleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Content is required')).toBeVisible();
    });
  });
});

test.describe('Assignments page - Student', () => {
  test.use({ storageState: STUDENT_STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    await page.goto('/assignments');
  });

  test('should not be visible and redirect to Home page', async ({ page }) => {
    await expect(page).toHaveURL('/home');
  });
});
