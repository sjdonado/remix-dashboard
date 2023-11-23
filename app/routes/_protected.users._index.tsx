import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';

import { asc, desc, sql } from 'drizzle-orm';
import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import type { UserSerialized } from '~/schemas/user';

import { formatDateToLocal } from '~/utils/date';
import { PAGE_SIZE } from '~/config/constants';

import {
  CreateBtnLink,
  DeleteBtnLink,
  MobileTable,
  ResponsiveTable,
  TableContainer,
  UpdateBtnLink,
} from '~/components/Table';
import Search from '~/components/Search';

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
          ? sql`(${usersTable.name} ilike ${`%${query}%`} 
            or ${usersTable.username} ilike ${`%${query}%`} )`
          : undefined
      )
  );

  const [[{ count }], users] = await Promise.all([
    db
      .with(sq)
      .select({ count: sql`count(*)` })
      .from(sq),
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

  return json({
    totalPages: Math.ceil(Number(count) / PAGE_SIZE),
    users: users as UserSerialized[],
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
            <div key={user.id} className="mb-2 w-full rounded-md bg-base-100 p-4">
              <div className="flex items-center justify-between border-b pb-4 gap-4">
                <div>
                  <div className="mb-2 flex items-center">
                    {/* <Image */}
                    {/*   src={invoice.image_url} */}
                    {/*   className="mr-2 rounded-full" */}
                    {/*   width={28} */}
                    {/*   height={28} */}
                    {/*   alt={`${invoice.name}'s profile picture`} */}
                    {/* /> */}
                    <p>{user.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{user.username}</p>
                </div>
                <span className="text-sm font-medium">{user.role}</span>
                {/* <InvoiceStatus status={invoice.status} /> */}
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div>
                  <p className="text-sm min-w-fit">
                    Created at {formatDateToLocal(user.createdAt)}
                  </p>
                  {/* <p className="text-xl font-medium">{formatCurrency(invoice.amount)}</p> */}
                </div>
                <div className="flex justify-end gap-2">
                  <UpdateBtnLink to={`${user.id}/edit`} />
                  <DeleteBtnLink
                    to={`${user.id}/delete`}
                    title="Delete User"
                    recordName={user.name}
                  />
                </div>
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
                <div className="flex items-center gap-3">
                  {/* <Image */}
                  {/*   src={invoice.image_url} */}
                  {/*   className="rounded-full" */}
                  {/*   width={28} */}
                  {/*   height={28} */}
                  {/*   alt={`${invoice.name}'s profile picture`} */}
                  {/* /> */}
                  <p>{user.name}</p>
                </div>
              </td>
              <td className="flex-1 whitespace-nowrap">{user.username}</td>
              {/* <td className="whitespace-nowrap px-3 py-3"> */}
              {/*   {formatCurrency(invoice.amount)} */}
              {/* </td> */}
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
