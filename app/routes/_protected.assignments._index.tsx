import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';

import { asc, desc, sql, eq, or, count } from 'drizzle-orm';

import { db } from '~/db/config.server';
import { assignmentsTable, usersTable } from '~/db/schema';
import { AssignmentSerializedSchema } from '~/schemas/assignment';

import { PAGE_SIZE } from '~/constants/search.server';

import { isAuthorized } from '~/services/auth.server';

import {
  CreateBtnLink,
  DeleteBtnLink,
  MobileTable,
  ResponsiveTable,
  TableContainer,
  UpdateBtnLink,
} from '~/components/Table';
import Search from '~/components/Search';
import Avatar from '~/components/Avatar';
import { AssignmentTypeBadge } from '~/components/badge/AssignmentTypeBadge';
import { AssignmentUpdateStatusDialogButton } from '~/components/dialog/AssignmentUpdateStatusDialog';
import { UserRole } from '~/constants/user';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await isAuthorized(
    request,
    [UserRole.Admin, UserRole.Teacher],
    '/'
  );

  const url = new URL(request.url);

  const query = url.searchParams.get('q')?.toString();
  const pageNumber = Number(url.searchParams.get('page') ?? 1);

  const sq = db.$with('sq').as(
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
      .where(
        or(
          userSession.isTeacher
            ? eq(assignmentsTable.authorId, userSession.id)
            : undefined,
          query
            ? sql`(${assignmentsTable.title} COLLATE NOCASE LIKE ${`%${query}%`} 
            or ${assignmentsTable.content} COLLATE NOCASE LIKE ${`%${query}%`})
            or ${usersTable.username} COLLATE NOCASE LIKE ${`%${query}%`}`
            : undefined
        )
      )
  );

  const [[{ count: totalRows }], assignments] = await Promise.all([
    db.with(sq).select({ count: count() }).from(sq),
    db
      .with(sq)
      .select()
      .from(sq)
      .orderBy(desc(sq.createdAt), asc(sq.id))
      .offset((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
  ]);

  const serializedAssignments = await Promise.all(
    assignments.map(assignment => AssignmentSerializedSchema.parseAsync(assignment))
  );

  return {
    totalPages: Math.ceil(Number(totalRows) / PAGE_SIZE),
    assignments: serializedAssignments,
  };
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
            <div key={assignment.id} className="w-full border-b bg-base-100 p-4">
              <div className="flex flex-col items-start gap-4">
                <div className="flex w-full items-center gap-2">
                  <div className="flex flex-1 items-center gap-1">
                    <Avatar
                      name={assignment.author.username!}
                      className="!size-6 !min-w-6"
                    />
                    <p className="text-sm text-gray-500">{assignment.author.username}</p>
                  </div>
                  <AssignmentUpdateStatusDialogButton
                    assignmentId={assignment.id}
                    status={assignment.status}
                  />
                  <AssignmentTypeBadge type={assignment.type} />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="min-w-fit text-xs">{assignment.createdAt}</span>
                  <Link to={`${assignment.id}/show`} className="link">
                    <p className="line-clamp-1">{assignment.title}</p>
                  </Link>
                </div>
                <p className="line-clamp-3 text-sm">{assignment.content}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4">
                <UpdateBtnLink to={`${assignment.id}/edit`} />
                <DeleteBtnLink
                  to={`${assignment.id}/delete`}
                  title="Delete Assignment"
                  recordName={assignment.title}
                />
              </div>
            </div>
          ))}
        </MobileTable>
        <ResponsiveTable
          headers={[
            'Title',
            'Status',
            'Type',
            'Author',
            'Content',
            'Points',
            'Due At',
            'Created At',
          ]}
        >
          {assignments?.map(assignment => (
            <tr
              key={assignment.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="w-44">
                <Link to={`${assignment.id}/show`} className="link">
                  <p className="line-clamp-1">{assignment.title}</p>
                </Link>
              </td>
              <td>
                <AssignmentUpdateStatusDialogButton
                  assignmentId={assignment.id}
                  status={assignment.status}
                />
              </td>
              <td>
                <AssignmentTypeBadge type={assignment.type} />
              </td>
              <td className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Avatar
                    name={assignment.author.username!}
                    className="!size-8 min-w-8"
                  />
                  <p className="text-sm">{assignment.author.username}</p>
                </div>
              </td>
              <td>
                <p className="line-clamp-2 max-w-sm">{assignment.content}</p>
              </td>
              <td>
                <p>{assignment.points}</p>
              </td>
              <td className="whitespace-nowrap p-3">{assignment.dueAt}</td>
              <td className="whitespace-nowrap p-3">{assignment.createdAt}</td>
              <td className="flex-1 whitespace-nowrap">
                <div className="flex justify-end gap-2">
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
