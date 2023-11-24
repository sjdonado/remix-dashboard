import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema } from '~/schemas/assignment';

import Assignment from '~/components/Assignment';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');

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
    .where(eq(assignmentsTable.id, params.assignmentId))
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .limit(1);

  if (!row) {
    return redirectWithToast('/assignments', {
      message: 'Assignment not found',
      type: 'error',
    });
  }

  const result = AssignmentSerializedSchema.safeParse(row);
  if (!result.success) {
    throw new Error(result.error.toString());
  }

  return json({ assignment: result.data });
};

export default function HomeShowAssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();

  return <Assignment assignment={assignment} />;
}
