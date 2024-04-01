import invariant from 'tiny-invariant';
import { eq } from 'drizzle-orm';
import { redirectWithToast } from 'remix-toast';

import { type ActionFunctionArgs } from '@remix-run/node';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';
import { isAuthorized } from '~/services/auth.server';

import { UserRole } from '~/constants/user';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  await isAuthorized(request, [UserRole.Admin, UserRole.Teacher]);

  const { searchParams } = new URL(request.url);

  await db.delete(assignmentsTable).where(eq(assignmentsTable.id, params.assignmentId));

  return redirectWithToast(`/assignments?${searchParams.toString()}`, {
    message: 'Assignment deleted successfully',
    type: 'success',
  });
};
