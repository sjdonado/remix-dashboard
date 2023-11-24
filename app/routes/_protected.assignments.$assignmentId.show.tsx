import { and, eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import type { AssignmentSerialized } from '~/schemas/assignment';

import { getSessionData } from '~/utils/session';

import Assignment from '~/components/Assignment';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const { userSession, isTeacher } = await getSessionData(request);

  const [assignment] = await db
    .select({
      id: assignmentsTable.id,
      title: assignmentsTable.title,
      content: assignmentsTable.content,
      createdAt: assignmentsTable.createdAt,
      author: {
        id: assignmentsTable.authorId,
        name: usersTable.name,
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

  if (!assignment) {
    return redirectWithToast('/assignments', {
      message: 'Assignment not found or not authorized to view',
      type: 'error',
    });
  }

  return json({ assignment });
};

export default function ShowAssignmentPage() {
  const { assignment } = useLoaderData<{ assignment: AssignmentSerialized }>();

  return <Assignment assignment={assignment} />;
}
