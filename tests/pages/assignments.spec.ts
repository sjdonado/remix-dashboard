import { faker } from '@faker-js/faker';
import { eq, ne } from 'drizzle-orm';

import type { Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  getAppSession,
} from '../helpers';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import type { AppSession } from '~/schemas/session';
import type { AssignmentSerialized } from '~/schemas/assignment';
import { PAGE_SIZE } from '~/config/constants.server';

test.describe('Assignments page - Admin', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  const ASSIGNMENT_ROW = 1;
  const TABLE_ROWS_LENGTH = PAGE_SIZE + 1;

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
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
    });

    test('should have pagination', async ({ page }) => {
      await expect(page.locator('a[href*="/assignments?page=3"]')).toBeVisible();
      await expect(page.locator('a[href*="/assignments?page=72"]')).toBeVisible();
    });

    test('should paginate assignments', async ({ page }) => {
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
      const firstAssignmentTitle = await page
        .getByRole('row')
        .nth(1)
        .getByRole('cell')
        .first()
        .textContent();

      await expect(page.locator('a[href*="/assignments?page=2"]').first()).toBeVisible();

      await page.locator('#pagination-next').click();
      await page.waitForURL('/assignments?page=2');

      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
      await expect(page.getByRole('row').nth(1).getByRole('cell').first()).not.toHaveText(
        firstAssignmentTitle!
      );
    });
  });

  test.describe('Search Assignments', () => {
    let title: string | null;
    let content: string | null;
    let authorName: string | null;

    test.beforeAll(async () => {
      [{ title, content, authorName }] = await db
        .select({
          title: assignmentsTable.title,
          content: assignmentsTable.content,
          authorName: usersTable.name,
        })
        .from(assignmentsTable)
        .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
        .offset(PAGE_SIZE * 2)
        .limit(1);
    });

    test('should filter by title', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search assignments...');

      await searchBar.fill(title!);
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(2);

      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').first()).toHaveText(title!);
    });

    test('should filter by content', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search assignments...');

      await searchBar.fill(content!.slice(0, 20));
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(2);
      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').nth(2).locator('p')).toHaveText(
        new RegExp(`${content!.slice(0, 20)}`)
      );
    });

    test('should filter by authorName', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search assignments...');

      await searchBar.fill(authorName!);
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(PAGE_SIZE + 1);
      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').nth(1).locator('p')).toHaveText(
        authorName!
      );
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

  test.describe('Create Assignment', () => {
    let appSession: AppSession;

    test.beforeEach(async ({ page, context }) => {
      const cookies = await context.cookies();
      appSession = await getAppSession(cookies);

      const newAssignmentButton = page.getByRole('link', { name: 'New Assignment' });
      await newAssignmentButton.click();
    });

    test('should create a new assignment', async ({ page }) => {
      const assignmentTitle = faker.lorem.words();
      const assignmentContent = faker.lorem.paragraph();

      const titleInput = page.getByLabel('Title');
      const contentInput = page.getByLabel('Content');
      const submitButton = page.getByRole('button', { name: 'Save' });

      await titleInput.fill(assignmentTitle);
      await contentInput.fill(assignmentContent);

      await submitButton.click();

      await expect(page).toHaveURL('/assignments');

      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').first()).toHaveText(assignmentTitle);
      await expect(assignment.getByRole('cell').nth(1).locator('p')).toHaveText(
        appSession.user.name
      );
    });

    test('should throw error message - empty title', async ({ page }) => {
      const titleInput = page.getByPlaceholder('Title');
      await titleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Title is required')).toBeVisible();
    });

    test('should throw error message - empty content', async ({ page }) => {
      const contentInput = page.getByPlaceholder('Content');
      await contentInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Content is required')).toBeVisible();
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

      const titleInput = page.getByLabel('Title');
      await titleInput.fill(newTitle);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await page.waitForLoadState('networkidle');

      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      await expect(assignment.getByRole('cell').first()).toHaveText(newTitle);

      // restore previous title
      await page.goto(editAssignmentUrl!);
      await titleInput.fill(assignmentTitle!);
      await submitButton.click();
    });

    test('should edit Content', async ({ page }) => {
      const newContent = 'New Content';

      const contentInput = page.getByPlaceholder('Content');
      await contentInput.fill(newContent);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      await expect(assignment.getByRole('cell').nth(2)).toHaveText(newContent);

      // restore previous content
      await page.goto(editAssignmentUrl!);
      await contentInput.fill(assignmentAuthor!);
      await submitButton.click();
    });

    test('should not be able to edit Author', async ({ page }) => {
      const assignmentAuthorSelectInput = page.getByLabel('Author');
      await expect(assignmentAuthorSelectInput).toBeDisabled();
    });

    test('should throw error message - empty title', async ({ page }) => {
      const titleInput = page.getByPlaceholder('Title');
      await titleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Title is required')).toBeVisible();
    });

    test('should throw error message - empty content', async ({ page }) => {
      const contentInput = page.getByPlaceholder('Content');
      await contentInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Content is required')).toBeVisible();
    });
  });

  test.describe('Delete Assignment', () => {
    const DELETE_ASSIGNMENT_ROW = 1;

    test.beforeEach(async ({ page }) => {
      await page.goto('/assignments?page=2');
      await page.waitForLoadState('networkidle');
    });

    test('should successfully delete assignment', async ({ page }) => {
      const assignment = page.getByRole('row').nth(DELETE_ASSIGNMENT_ROW);
      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const deleteAssignmentButton = assignment.getByRole('button');

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const deleteButton = deleteModal.getByRole('button', { name: 'Delete' });
      await deleteButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(page.getByText(assignmentTitle!).nth(1)).not.toBeVisible();
    });

    test('should go back from delete confirmation modal', async ({ page }) => {
      const assignment = page.getByRole('row').nth(DELETE_ASSIGNMENT_ROW);
      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const deleteAssignmentButton = assignment.getByRole('button');

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const cancelButton = deleteModal.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(page.getByText(assignmentTitle!).nth(1)).toBeVisible();
    });
  });
});

test.describe('Assignments page - Teacher', () => {
  test.use({ storageState: TEACHER_STORAGE_STATE });

  const ASSIGNMENT_ROW = 1;
  const TABLE_ROWS_LENGTH = PAGE_SIZE + 1;

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
      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
    });

    test('should have pagination - only one page', async ({ page }) => {
      await expect(page.locator('div').filter({ hasText: /^1$/ }).nth(0)).toBeVisible();
    });
  });

  test.describe('Show Assignment', () => {
    let appSession: AppSession;

    test.beforeEach(async ({ context }) => {
      const cookies = await context.cookies();
      appSession = await getAppSession(cookies);
    });

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
      const assignments = await page.getByRole('row').all();

      await Promise.all(
        assignments
          .slice(1)
          .map((assignment: Locator) =>
            expect(assignment.getByRole('cell').nth(1).locator('p')).toHaveText(
              appSession.user.name
            )
          )
      );
    });
  });

  test.describe('Create Assignment', () => {
    let appSession: AppSession;

    test.beforeEach(async ({ page, context }) => {
      const cookies = await context.cookies();
      appSession = await getAppSession(cookies);

      const newAssignmentButton = page.getByRole('link', { name: 'New Assignment' });
      await newAssignmentButton.click();
    });

    test('should create a new assignment', async ({ page }) => {
      const assignmentTitle = faker.lorem.words();
      const assignmentContent = faker.lorem.paragraph();

      const titleInput = page.getByLabel('Title');
      const contentInput = page.getByLabel('Content');
      const submitButton = page.getByRole('button', { name: 'Save' });

      await titleInput.fill(assignmentTitle);
      await contentInput.fill(assignmentContent);

      await submitButton.click();

      await expect(page).toHaveURL('/assignments');

      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').first()).toHaveText(assignmentTitle);
      await expect(assignment.getByRole('cell').nth(1).locator('p')).toHaveText(
        appSession.user.name
      );
    });

    test('should throw error message - empty title', async ({ page }) => {
      const titleInput = page.getByPlaceholder('Title');
      await titleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Title is required')).toBeVisible();
    });

    test('should throw error message - empty content', async ({ page }) => {
      const contentInput = page.getByPlaceholder('Content');
      await contentInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Content is required')).toBeVisible();
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

      const titleInput = page.getByPlaceholder('Title');
      await titleInput.fill(newTitle);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await page.waitForLoadState('networkidle');

      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      await expect(assignment.getByRole('cell').first()).toHaveText(newTitle);

      // restore previous title
      await page.goto(editAssignmentUrl!);
      await titleInput.fill(assignmentTitle!);
      await submitButton.click();
    });

    test('should edit Content', async ({ page }) => {
      const newContent = 'New Content';

      const contentInput = page.getByPlaceholder('Content');
      await contentInput.fill(newContent);

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await expect(
        page.getByRole('row').nth(ASSIGNMENT_ROW).getByRole('cell').nth(2)
      ).toHaveText(newContent);

      // restore previous content
      await page.goto(editAssignmentUrl!);
      await contentInput.fill(assignmentAuthor!);
      await submitButton.click();
    });

    test('should not be able to edit Author', async ({ page }) => {
      const assignmentAuthorSelectInput = page.getByLabel('Author');
      await expect(assignmentAuthorSelectInput).toBeDisabled();
    });

    test('should throw error message - empty title', async ({ page }) => {
      const titleInput = page.getByPlaceholder('Title');
      await titleInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Title is required')).toBeVisible();
    });

    test('should throw error message - empty content', async ({ page }) => {
      const contentInput = page.getByPlaceholder('Content');
      await contentInput.fill('');

      const submitButton = page.getByRole('button', { name: 'Edit Assignment' });
      await submitButton.click();

      await expect(page.getByText('Content is required')).toBeVisible();
    });
  });

  test.describe('Delete Assignment', () => {
    const DELETE_ASSIGNMENT_ROW = 1;

    test.beforeEach(async ({ page }) => {
      await page.goto('/assignments?page=2');
      await page.waitForLoadState('networkidle');
    });

    test('should successfully delete assignment', async ({ page }) => {
      const assignment = page.getByRole('row').nth(DELETE_ASSIGNMENT_ROW);
      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const deleteAssignmentButton = assignment.getByRole('button');

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const deleteButton = deleteModal.getByRole('button', { name: 'Delete' });
      await deleteButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(page.getByText(assignmentTitle!).nth(1)).not.toBeVisible();
    });

    test('should go back from delete confirmation modal', async ({ page }) => {
      const assignment = page.getByRole('row').nth(DELETE_ASSIGNMENT_ROW);
      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const deleteAssignmentButton = assignment.getByRole('button');

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const cancelButton = deleteModal.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(page.getByText(assignmentTitle!).nth(1)).toBeVisible();
    });
  });

  test.describe('Forbidden Access', () => {
    let assignment: AssignmentSerialized;

    test.beforeEach(async ({ context }) => {
      const cookies = await context.cookies();
      const appSession = await getAppSession(cookies);

      const [row] = await db
        .select({
          id: assignmentsTable.id,
          title: assignmentsTable.title,
          content: assignmentsTable.content,
          createdAt: assignmentsTable.createdAt,
          author: {
            id: assignmentsTable.authorId,
            name: usersTable.name,
            username: usersTable.username,
          },
        })
        .from(assignmentsTable)
        .where(ne(assignmentsTable.authorId, appSession.user.id))
        .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
        .limit(1);

      assignment = row as AssignmentSerialized;
    });

    test('should not be visible', async ({ page }) => {
      await page.goto(`/assignments/${assignment.id}/show`);
      await expect(page).toHaveURL('/assignments');
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
