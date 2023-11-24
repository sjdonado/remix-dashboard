import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import type { AssignmentSerialized } from '~/schemas/assignment';

import Assignment from '~/components/Assignment';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');

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
    .where(eq(assignmentsTable.id, params.assignmentId))
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .limit(1);

  if (!assignment) {
    return redirectWithToast('/assignments', {
      message: 'Assignment not found',
      type: 'error',
    });
  }

  return json({ assignment });
};

export default function HomeShowAssignmentPage() {
  const { assignment } = useLoaderData<{ assignment: AssignmentSerialized }>();

  return <Assignment assignment={assignment} />;
}
