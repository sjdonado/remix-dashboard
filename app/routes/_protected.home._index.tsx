import Avatar from 'react-avatar';
import React from 'react';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';

import { asc, desc, sql, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core/alias';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';

import { formatDateToLocal } from '~/utils/date';
import { PAGE_SIZE } from '~/config/constants';

import Pagination from '~/components/Pagination';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const useLayoutEffect = canUseDOM ? React.useLayoutEffect : () => {};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const pageNumber = Number(url.searchParams.get('page') ?? 1);

  const author = alias(usersTable, 'parent');

  const sq = db.$with('sq').as(
    db
      .select({
        id: assignmentsTable.id,
        title: assignmentsTable.title,
        content: assignmentsTable.content,
        createdAt: assignmentsTable.createdAt,
        author: {
          id: assignmentsTable.authorId,
          name: author.name,
        },
      })
      .from(assignmentsTable)
      .leftJoin(author, eq(assignmentsTable.authorId, author.id))
  );

  const [[{ count }], assignments] = await Promise.all([
    db
      .with(sq)
      .select({ count: sql`count(*)` })
      .from(sq),
    db
      .with(sq)
      .select()
      .from(sq)
      .orderBy(desc(sq.createdAt), asc(sq.id))
      .offset((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
  ]);

  return json({
    totalPages: Math.ceil(Number(count) / PAGE_SIZE),
    assignments,
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
    <div id="assignments" className="flex flex-col gap-4 overflow-y-auto h-[92vh]">
      <div className="flex flex-col gap-2">
        {assignments?.map(assignment => (
          <div key={assignment.id} className="w-full border rounded-lg bg-base-100 p-4">
            <div className="flex items-start justify-start pb-4 gap-2">
              <Avatar
                name={assignment.author.name as string}
                round
                size="48"
                alt={assignment.author.name as string}
              />
              <div className="flex flex-col items-start gap-1">
                <Link to={`/home/${assignment.id}/show`} className="link">
                  {assignment.title}
                </Link>
                <span className="text-xs min-w-fit">
                  {formatDateToLocal(assignment.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between pt-1">
              <p className="text-sm line-clamp-3">{assignment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
