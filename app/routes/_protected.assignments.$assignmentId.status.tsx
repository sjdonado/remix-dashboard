import invariant from 'tiny-invariant';
import { and, eq } from 'drizzle-orm';

import type { ActionFunctionArgs } from '@remix-run/node';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';
import { AssignmentUpdateStatusSchema } from '~/schemas/assignment';

import { isAuthorized } from '~/services/auth.server';
import { UserRole } from '~/constants/user';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const userSession = await isAuthorized(request, [UserRole.Admin, UserRole.Teacher]);

  const data = await request.formData();

  const { status } = await AssignmentUpdateStatusSchema.parseAsync({
    status: data.get('status'),
  });

  const [assignment] = await db
    .update(assignmentsTable)
    .set({ status })
    .where(
      and(
        userSession.isTeacher ? eq(assignmentsTable.authorId, userSession.id) : undefined,
        eq(assignmentsTable.id, params.assignmentId as string)
      )
    )
    .returning();

  if (!assignment) {
    return {
      error: 'Assignment not found or you are not authorized to update this assignment',
    };
  }

  return {
    message: 'Assignment updated successfully',
  };
};
