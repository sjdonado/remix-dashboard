import invariant from 'tiny-invariant';
import { eq } from 'drizzle-orm';
import { redirectWithToast } from 'remix-toast';

import { type ActionFunctionArgs } from '@remix-run/node';

import { db } from '~/db/config.server';
import { assignmentsTable } from '~/db/schema';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const { searchParams } = new URL(request.url);

  await db.delete(assignmentsTable).where(eq(assignmentsTable.id, params.assignmentId));

  return redirectWithToast(`/assignments?${searchParams.toString()}`, {
    message: 'Assignment deleted successfully',
    type: 'success',
  });
};
