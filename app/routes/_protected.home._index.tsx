import React from 'react';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';

import { asc, desc, sql, eq } from 'drizzle-orm';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import {
  AssignmentSerializedCardSchema,
  AssignmentSerializedSchema,
} from '~/schemas/assignment';

import { PAGE_SIZE } from '~/constants/search.server';
import { formatDateToLocal } from '~/utils/date';

import Pagination from '~/components/Pagination';
import Avatar from '~/components/Avatar';
import AssignmentCard from '~/components/AssignmentCard';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const useLayoutEffect = canUseDOM ? React.useLayoutEffect : () => {};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const pageNumber = Number(url.searchParams.get('page') ?? 1);

  const [[{ count }], assignments] = await Promise.all([
    db.select({ count: sql`count(*)` }).from(assignmentsTable),
    db
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
      .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
      .orderBy(desc(assignmentsTable.createdAt), asc(assignmentsTable.id))
      .offset((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
  ]);

  const serializedAssignments = await Promise.all(
    assignments.map(assignment => AssignmentSerializedSchema.parseAsync(assignment))
  );

  return json({
    totalPages: Math.ceil(Number(count) / PAGE_SIZE),
    assignments: serializedAssignments,
  });
};

export default function HomePage() {
  const { totalPages, assignments } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  let currentPage = Number(searchParams.get('page') ?? 1);

  useLayoutEffect(() => {
    document.getElementById('assignments')?.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <div id="assignments" className="flex h-[92vh] flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {assignments?.map(assignment => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
      <div className="flex flex-1 justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
