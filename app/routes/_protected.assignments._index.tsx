import Avatar from 'react-avatar';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';

import { asc, desc, sql, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core/alias';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import type { AssignmentSerialized } from '~/schemas/assignment';

import { formatDateToLocal } from '~/utils/date';
import { PAGE_SIZE } from '~/config/constants';

import {
  CreateBtnLink,
  DeleteBtnLink,
  MobileTable,
  ResponsiveTable,
  ShowBtnLink,
  TableContainer,
  UpdateBtnLink,
} from '~/components/Table';
import Search from '~/components/Search';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const query = url.searchParams.get('q')?.toString();
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
      .where(
        query
          ? sql`(${assignmentsTable.title} ilike ${`%${query}%`} 
            or ${assignmentsTable.content} ilike ${`%${query}%`})
            or ${author.name} ilike ${`%${query}%`} `
          : undefined
      )
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
    assignments: assignments as AssignmentSerialized[],
  });
};

export default function AssignmentsPage() {
  const { assignments, totalPages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  let currentPage = Number(searchParams.get('page') ?? 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex items-center justify-between gap-2">
        <Search placeholder="Search assignments..." />
        <CreateBtnLink to="new" title="New Assignment" />
      </div>
      <TableContainer totalPages={totalPages} currentPage={currentPage}>
        <MobileTable>
          {assignments?.map(assignment => (
            <div key={assignment.id} className="mb-2 w-full rounded-md bg-base-100 p-4">
              <div className="flex items-center justify-between border-b pb-4 gap-4">
                <div>
                  <div className="mb-2 flex items-center">
                    <p>{assignment.title}</p>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <Avatar
                      name={assignment.author.name}
                      round
                      size="32"
                      alt={assignment.author.name}
                    />
                    <p className="text-sm text-gray-500">{assignment.author.name}</p>
                  </div>
                </div>
                <span className="text-xs min-w-fit">
                  {formatDateToLocal(assignment.createdAt)}
                </span>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div>
                  <p className="text-sm line-clamp-3">{assignment.content}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <ShowBtnLink to={`${assignment.id}`} />
                  <UpdateBtnLink to={`${assignment.id}/edit`} />
                  <DeleteBtnLink
                    to={`${assignment.id}/delete`}
                    title="Delete Assignment"
                    recordName={assignment.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </MobileTable>
        <ResponsiveTable headers={['Title', 'Author', 'Content', 'Created At']}>
          {assignments?.map(assignment => (
            <tr
              key={assignment.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="flex-1">
                <p className="line-clamp-2">{assignment.title}</p>
              </td>
              <td className="flex-1 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Avatar
                    name={assignment.author.name}
                    round
                    size="32"
                    alt={assignment.author.name}
                  />
                  <p>{assignment.author.name}</p>
                </div>
              </td>
              <td className="flex-1">
                <p className="line-clamp-2 max-w-sm">{assignment.content}</p>
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {formatDateToLocal(assignment.createdAt)}
              </td>
              <td className="flex-1 whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <ShowBtnLink to={`${assignment.id}`} />
                  <UpdateBtnLink to={`${assignment.id}/edit`} />
                  <DeleteBtnLink
                    to={`${assignment.id}/delete`}
                    title="Delete Assignment"
                    recordName={assignment.title}
                  />
                </div>
              </td>
            </tr>
          ))}
        </ResponsiveTable>
      </TableContainer>
    </div>
  );
}
