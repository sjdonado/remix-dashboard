import { and, eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';

import type { LoaderFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import type { AssignmentSerialized } from '~/schemas/assignment';
import { AssignmentSerializedSchema } from '~/schemas/assignment';

import { isAuthenticated } from '~/services/auth.server';

import { Breadcrumb } from '~/components/Breadcrumbs';
import AssignmentCard from '~/components/AssignmentCard';

export const handle = {
  breadcrumb: (match: UIMatch) => {
    const { assignment } = (match.data as { assignment: AssignmentSerialized }) ?? {};
    return <Breadcrumb pathname={match.pathname} label={assignment?.title} />;
  },
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');
  const userSession = await isAuthenticated(request);

  const [row] = await db
    .select({
      id: assignmentsTable.id,
      status: assignmentsTable.status,
      type: assignmentsTable.type,
      title: assignmentsTable.title,
      content: assignmentsTable.content,
      points: assignmentsTable.points,
      dueAt: assignmentsTable.dueAt,
      createdAt: assignmentsTable.createdAt,
      updatedAt: assignmentsTable.updatedAt,
      author: {
        id: assignmentsTable.authorId,
        username: usersTable.username,
      },
    })
    .from(assignmentsTable)
    .where(
      and(
        userSession.isTeacher ? eq(assignmentsTable.authorId, userSession.id) : undefined,
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

  const assignment = await AssignmentSerializedSchema.parseAsync(row);

  return { assignment };
};

export default function ShowAssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();

  return <AssignmentCard assignment={assignment} expanded />;
}
