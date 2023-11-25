import { and, eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema } from '~/schemas/assignment';

import { getSessionData } from '~/utils/session.server';

import Assignment from '~/components/Assignment';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const { userSession, isTeacher } = await getSessionData(request);

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
    .where(
      and(
        isTeacher ? eq(assignmentsTable.authorId, userSession.id) : undefined,
        eq(assignmentsTable.id, params.assignmentId)
      )
    )
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .limit(1);

  if (!row) {
    return redirectWithToast('/assignments', {
      message: 'Assignment not found or not authorized to view',
      type: 'error',
    });
  }

  const result = AssignmentSerializedSchema.safeParse(row);
  if (!result.success) {
    throw new Error(result.error.toString());
  }

  return json({ assignment: result.data });
};

export default function ShowAssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();

  return <Assignment assignment={assignment} />;
}
