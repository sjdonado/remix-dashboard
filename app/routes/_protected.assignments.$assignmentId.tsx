import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import Avatar from 'react-avatar';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { formatDateToLocal } from '~/utils/date';
import BackButton from '~/components/forms/BackButton';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.assignmentId, 'Missing assignmentId param');

  const [assignment] = await db
    .select({
      id: assignmentsTable.id,
      title: assignmentsTable.title,
      content: assignmentsTable.content,
      createdAt: assignmentsTable.createdAt,
      author: {
        name: usersTable.name,
      },
    })
    .from(assignmentsTable)
    .where(eq(assignmentsTable.id, params.assignmentId))
    .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
    .limit(1);

  if (!assignment) {
    return redirect('/assignments');
  }

  return json({ assignment });
};

export default function AssignmentPage() {
  const { assignment } = useLoaderData<typeof loader>();
  const author = assignment.author!;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-base-200/50 p-2">
        <div className="flex flex-col bg-base-100 rounded-lg gap-4 p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center text-sm gap-2">
              <Avatar name={author.name} round size="32" alt={author.name} />
              <span className="font-semibold">{author.name}</span>
              <p className="text-gray-500">{formatDateToLocal(assignment.createdAt)}</p>
            </div>
            <h1 className="text-3xl mt-2">{assignment.title}</h1>
            <p className="">{assignment.content}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <BackButton message="Go back" />
      </div>
    </div>
  );
}
