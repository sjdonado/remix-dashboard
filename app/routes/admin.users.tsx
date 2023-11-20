import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';

import { sql } from 'drizzle-orm';
import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';

import type { UserSerialized } from '~/schemas/user';

import { PAGE_SIZE } from '~/config/constants';

import Table from '~/components/Table';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pageNumber = Number(url.searchParams.get('page') ?? 1);

  const [{ count }] = await db.execute(sql`select count(*) from ${usersTable}`);

  const users: UserSerialized[] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      role: usersTable.role,
    })
    .from(usersTable)
    .offset((pageNumber - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  return json({
    data: users,
    totalPages: Math.ceil(Number(count) / PAGE_SIZE),
  });
};

export default function UserPage() {
  const { data, totalPages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  // const query = searchParams.get('q') ?? '';
  const currentPage = Number(searchParams.get('page') ?? 1);

  return (
    <Table
      data={data}
      headers={['name', 'username', 'role']}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
