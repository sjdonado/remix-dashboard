import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';

import { PAGE_SIZE } from '~/config/constants.server';
import { formatDateToLocal } from '~/utils/date';

import { asc, count, desc, sql } from 'drizzle-orm';
import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import { UserSerializedSchema } from '~/schemas/user';

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const query = url.searchParams.get('q')?.toString();
  const pageNumber = Number(url.searchParams.get('page') ?? 1);

  const sq = db.$with('sq').as(
    db
      .select()
      .from(usersTable)
      .where(
        query
          ? sql`${usersTable.name} COLLATE NOCASE LIKE ${`%${query}%`} 
            or ${usersTable.username} COLLATE NOCASE LIKE ${`%${query}%`}`
          : undefined
      )
  );

  const [[{ count: totalRows }], users] = await Promise.all([
    db.with(sq).select({ count: count() }).from(sq),
    db
      .with(sq)
      .select({
        id: sq.id,
        name: sq.name,
        username: sq.username,
        role: sq.role,
        createdAt: sq.createdAt,
      })
      .from(sq)
      .orderBy(desc(sq.createdAt), asc(sq.id))
      .offset((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
  ]);

  const parsedUsers = users.map(user => {
    const result = UserSerializedSchema.safeParse(user);
    if (!result.success) {
      throw new Error(result.error.toString());
    }
    return result.data;
  });

  return json({
    totalPages: Math.ceil(Number(totalRows) / PAGE_SIZE),
    users: parsedUsers,
  });
};

export default function UsersPage() {
  const { users, totalPages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  let currentPage = Number(searchParams.get('page') ?? 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex items-center justify-between gap-2">
        <Search placeholder="Search users..." />
        <CreateBtnLink to="create" title="Create User" />
      </div>
      <TableContainer totalPages={totalPages} currentPage={currentPage}>
        <MobileTable>
          {users?.map(user => (
            <div key={user.id} className="w-full bg-base-100 border-b p-4">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.name} />
                    <p className="text-sm text-gray-500">{user.name}</p>
                  </div>
                  <span className="text-xs min-w-fit">
                    {formatDateToLocal(user.createdAt)}
                  </span>
                </div>
                <p>{user.role}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4">
                <UpdateBtnLink to={`${user.id}/edit`} />
                <DeleteBtnLink
                  to={`${user.id}/delete`}
                  title="Delete User"
                  recordName={user.name}
                />
              </div>
            </div>
          ))}
        </MobileTable>
        <ResponsiveTable headers={['Full Name', 'Username', 'Role', 'Created At']}>
          {users?.map(user => (
            <tr
              key={user.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-2">
                  <Avatar name={user.name} />
                  <p>{user.name}</p>
                </div>
              </td>
              <td className="flex-1 whitespace-nowrap">{user.username}</td>
              <td className="flex-1 whitespace-nowrap">{user.role}</td>
              <td className="whitespace-nowrap px-3 py-3">
                {formatDateToLocal(user.createdAt)}
              </td>
              <td className="flex-1 whitespace-nowrap">
                <div className="flex justify-end gap-3">
                  <UpdateBtnLink to={`${user.id}/edit`} />
                  <DeleteBtnLink
                    to={`${user.id}/delete`}
                    title="Delete User"
                    recordName={user.name}
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
