import { eq, ne } from 'drizzle-orm';

import type { Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';

import {
  ADMIN_STORAGE_STATE,
  STUDENT_STORAGE_STATE,
  TEACHER_STORAGE_STATE,
  getUserSession,
} from '../helpers';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import type { AssignmentSerialized } from '~/schemas/assignment';

import { PAGE_SIZE } from '~/constants/search.server';
import type { UserSession } from '~/schemas/user';
import { AssignmentType, MOCKED_ASSIGNMENT_BY_TYPE } from '~/constants/assignment';

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
      const firstPageTable = await page.getByRole('table').textContent();

      await expect(page.locator('a[href*="/assignments?page=2"]').first()).toBeVisible();

      await page.locator('#pagination-next').click();
      await page.waitForURL('/assignments?page=2');

      await expect(page.getByRole('row')).toHaveCount(TABLE_ROWS_LENGTH);
      await expect(page.getByRole('table')).not.toHaveText(firstPageTable!);
    });
  });

  test.describe('Search Assignments', () => {
    let title: string | null;
    let content: string | null;
    let authorUsername: string | null;

    test.beforeAll(async () => {
      [{ title, content, authorUsername }] = await db
        .select({
          title: assignmentsTable.title,
          content: assignmentsTable.content,
          authorUsername: usersTable.username,
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

      await expect(page.getByRole('row')).toHaveCount(PAGE_SIZE + 1);

      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').first()).toHaveText(title!);
    });

    test('should filter by content', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search assignments...');

      await searchBar.fill(content!.slice(0, 20));
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(PAGE_SIZE + 1);
      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').nth(4).locator('p')).toHaveText(
        new RegExp(`${content!.slice(0, 20)}`)
      );
    });

    test('should filter by authorName', async ({ page }) => {
      const searchBar = page.getByPlaceholder('Search assignments...');

      await searchBar.fill(authorUsername!);
      await searchBar.press('Enter');

      await expect(page.getByRole('row')).toHaveCount(PAGE_SIZE + 1);
      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').nth(3).locator('p')).toHaveText(
        new RegExp(`${authorUsername}`)
      );
    });
  });

  test.describe('Show Assignment', () => {
    test('should go to show assignment page', async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const showAssignmentButton = assignment.locator('a').first();

      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const assignmentContent = await assignment.getByRole('cell').nth(4).textContent();
      const assignmentDueAt = await assignment.getByRole('cell').nth(6).textContent();
      const assignmentCreatedAt = await assignment.getByRole('cell').nth(7).textContent();
      const showAssignmentUrl = await showAssignmentButton.getAttribute('href');

      await showAssignmentButton.click();

      await expect(page).toHaveURL(showAssignmentUrl!);
      await expect(page.locator('h1')).toHaveText(assignmentTitle!);
      await expect(page.getByText(assignmentContent!)).toBeVisible();
      await expect(page.getByText(assignmentDueAt!)).toBeVisible();
      await expect(page.getByText(assignmentCreatedAt!)).toBeVisible();
    });
  });

  test.describe('Create Assignment', () => {
    let userSession: UserSession;

    test.beforeEach(async ({ page, context }) => {
      const cookies = await context.cookies();
      userSession = await getUserSession(cookies);

      const newAssignmentButton = page.getByRole('link', { name: 'New Assignment' });
      await newAssignmentButton.click();
    });

    test('should create a new assignment', async ({ page }) => {
      const assignmentType = AssignmentType.Project;

      const { title } = MOCKED_ASSIGNMENT_BY_TYPE[assignmentType];

      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption(assignmentType);

      const submitButton = page.getByRole('button', { name: 'Save' });

      await submitButton.click();

      await expect(page).toHaveURL('/assignments');

      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').first()).toHaveText(title);
      await expect(assignment.getByRole('cell').nth(3).locator('p')).toHaveText(
        userSession.username
      );
    });

    test('should throw error message - empty type', async ({ page }) => {
      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Type is required')).toBeVisible();
    });
  });

  test.describe('Edit Assignment', () => {
    let assignmentTitle: string | null;
    let assignmentType: string | null;
    let editAssignmentUrl: string | null;

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const editAssignmentButton = assignment.locator('a').nth(1);

      assignmentTitle = await assignment.getByRole('cell').first().textContent();
      assignmentType = await assignment
        .getByRole('cell')
        .nth(2)
        .locator('span')
        .textContent();

      editAssignmentUrl = await editAssignmentButton.getAttribute('href');

      await editAssignmentButton.click();

      const titleInput = page.getByLabel('Title');
      const typeSelect = page.getByLabel('Choose type');

      await expect(titleInput).toHaveValue(assignmentTitle!);
      await expect(typeSelect).toHaveValue(assignmentType!.toUpperCase());
    });

    test('should edit type', async ({ page }) => {
      const newAssignmentType = [
        AssignmentType.Project,
        AssignmentType.Quiz,
        AssignmentType.Homework,
      ].find(a => a.toUpperCase() !== assignmentType?.toUpperCase());

      const { title } = MOCKED_ASSIGNMENT_BY_TYPE[newAssignmentType!];

      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption(newAssignmentType!);

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await page.waitForLoadState('networkidle');
      await page.reload();

      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      await expect(assignment.getByRole('cell').first()).toHaveText(title);

      // restore previous title
      await page.goto(editAssignmentUrl!);
      await typeSelect.selectOption(assignmentType);
      await submitButton.click();
    });

    test('should throw error message - empty type', async ({ page }) => {
      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Type is required')).toBeVisible();
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
      const deleteAssignmentButton = assignment.getByRole('button').nth(1);

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const deleteButton = deleteModal.getByRole('button', { name: 'Delete' });
      await deleteButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
    });

    test('should go back from delete confirmation modal', async ({ page }) => {
      const assignment = page.getByRole('row').nth(DELETE_ASSIGNMENT_ROW);
      const deleteAssignmentButton = assignment.getByRole('button').nth(1);

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const cancelButton = deleteModal.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(assignment).toBeVisible();
    });
  });
});

test.describe('Assignments page - Teacher', () => {
  test.use({ storageState: TEACHER_STORAGE_STATE });

  const ASSIGNMENT_ROW = 2;
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
    let userSession: UserSession;

    test.beforeEach(async ({ context }) => {
      const cookies = await context.cookies();
      userSession = await getUserSession(cookies);
    });

    test('should go to show assignment page', async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const showAssignmentButton = assignment.locator('a').first();

      const assignmentTitle = await assignment.getByRole('cell').first().textContent();
      const assignmentContent = await assignment.getByRole('cell').nth(4).textContent();
      const assignmentDueAt = await assignment.getByRole('cell').nth(6).textContent();
      const assignmentCreatedAt = await assignment.getByRole('cell').nth(7).textContent();
      const showAssignmentUrl = await showAssignmentButton.getAttribute('href');

      await showAssignmentButton.click();

      await expect(page).toHaveURL(showAssignmentUrl!);
      await expect(page.locator('h1')).toHaveText(assignmentTitle!);
      await expect(page.getByText(assignmentContent!)).toBeVisible();
      await expect(page.getByText(assignmentDueAt!)).toBeVisible();
      await expect(page.getByText(assignmentCreatedAt!)).toBeVisible();
    });

    test('should show only author assignments', async ({ page }) => {
      const assignments = await page.getByRole('row').all();

      await Promise.all(
        assignments
          .slice(1)
          .map((assignment: Locator) =>
            expect(assignment.getByRole('cell').nth(3).locator('p')).toHaveText(
              userSession.username
            )
          )
      );
    });
  });

  test.describe('Create Assignment', () => {
    let userSession: UserSession;

    test.beforeEach(async ({ page, context }) => {
      const cookies = await context.cookies();
      userSession = await getUserSession(cookies);

      const newAssignmentButton = page.getByRole('link', { name: 'New Assignment' });
      await newAssignmentButton.click();
    });

    test('should create a new assignment', async ({ page }) => {
      const assignmentType = AssignmentType.Project;

      const { title } = MOCKED_ASSIGNMENT_BY_TYPE[assignmentType];

      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption(assignmentType);

      const submitButton = page.getByRole('button', { name: 'Save' });

      await submitButton.click();

      await expect(page).toHaveURL('/assignments');

      const assignment = page.getByRole('row').nth(1);
      await expect(assignment.getByRole('cell').first()).toHaveText(title);
      await expect(assignment.getByRole('cell').nth(3).locator('p')).toHaveText(
        userSession.username
      );
    });

    test('should throw error message - empty type', async ({ page }) => {
      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Type is required')).toBeVisible();
    });
  });

  test.describe('Edit Assignment', () => {
    let assignmentTitle: string | null;
    let assignmentType: string | null;
    let editAssignmentUrl: string | null;

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      const editAssignmentButton = assignment.locator('a').nth(1);

      assignmentTitle = await assignment.getByRole('cell').first().textContent();
      assignmentType = await assignment
        .getByRole('cell')
        .nth(2)
        .locator('span')
        .textContent();

      editAssignmentUrl = await editAssignmentButton.getAttribute('href');

      await editAssignmentButton.click();

      const titleInput = page.getByLabel('Title');
      const typeSelect = page.getByLabel('Choose type');

      await expect(titleInput).toHaveValue(assignmentTitle!);
      await expect(typeSelect).toHaveValue(assignmentType!.toUpperCase());
    });

    test('should edit type', async ({ page }) => {
      const newAssignmentType = [
        AssignmentType.Project,
        AssignmentType.Quiz,
        AssignmentType.Homework,
      ].find(a => a.toUpperCase() !== assignmentType?.toUpperCase());

      const { title } = MOCKED_ASSIGNMENT_BY_TYPE[newAssignmentType!];

      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption(newAssignmentType!);

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page).toHaveURL('/assignments');
      await page.waitForLoadState('networkidle');
      await page.reload();

      const assignment = page.getByRole('row').nth(ASSIGNMENT_ROW);
      await expect(assignment.getByRole('cell').first()).toHaveText(title);

      // restore previous title
      await page.goto(editAssignmentUrl!);
      await typeSelect.selectOption(assignmentType);
      await submitButton.click();
    });

    test('should throw error message - empty type', async ({ page }) => {
      const typeSelect = page.getByLabel('Choose type');
      await typeSelect.selectOption('');

      const submitButton = page.getByRole('button', { name: 'Save' });
      await submitButton.click();

      await expect(page.getByText('Type is required')).toBeVisible();
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
      const deleteAssignmentButton = assignment.getByRole('button').nth(1);

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const deleteButton = deleteModal.getByRole('button', { name: 'Delete' });
      await deleteButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(assignment).not.toBeVisible();
    });

    test('should go back from delete confirmation modal', async ({ page }) => {
      const assignment = page.getByRole('row').nth(DELETE_ASSIGNMENT_ROW);
      const deleteAssignmentButton = assignment.getByRole('button').nth(1);

      await deleteAssignmentButton.click();

      const deleteModal = page.locator('dialog[open]');
      await expect(deleteModal.locator('h3')).toHaveText('Delete User');

      const cancelButton = deleteModal.getByRole('button', { name: 'Cancel' });
      await cancelButton.click();

      await expect(page).toHaveURL('/assignments?page=2');
      await expect(assignment).toBeVisible();
    });
  });

  test.describe('Forbidden Access', () => {
    let assignment: AssignmentSerialized;

    test.beforeEach(async ({ context }) => {
      const cookies = await context.cookies();
      const userSession = await getUserSession(cookies);

      const [row] = await db
        .select({
          id: assignmentsTable.id,
          title: assignmentsTable.title,
          content: assignmentsTable.content,
          createdAt: assignmentsTable.createdAt,
          updatedAt: assignmentsTable.updatedAt,
          author: {
            id: assignmentsTable.authorId,
            username: usersTable.username,
          },
        })
        .from(assignmentsTable)
        .where(ne(assignmentsTable.authorId, userSession.id))
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
