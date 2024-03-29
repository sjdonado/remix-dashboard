import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { redirectWithToast } from 'remix-toast';

import type { LoaderFunctionArgs } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema } from '~/schemas/assignment';

import { flatSafeParseAsync } from '~/utils/zod.server';

import { Breadcrumb } from '~/components/Breadcrumbs';
import Assignment from '~/components/Assignment';

export const handle = {
  breadcrumb: (match: UIMatch) => (
    <Breadcrumb pathname={match.pathname} label="Show Details" />
  ),
};

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

  const assignment = await flatSafeParseAsync(AssignmentSerializedSchema, row);

  return { assignment };
};

export default function HomeShowAssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();

  return <Assignment assignment={assignment} />;
}
