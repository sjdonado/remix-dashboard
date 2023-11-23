import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';

import { asc, desc, sql, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core/alias';

import { db } from '~/db/config.server';
import { postsTable, usersTable } from '~/db/schema';
import type { PostSerialized } from '~/schemas/post';

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

  const author = alias(usersTable, 'parent');

  const sq = db.$with('sq').as(
    db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        content: postsTable.content,
        createdAt: postsTable.createdAt,
        author: {
          id: postsTable.authorId,
          name: author.name,
          username: author.username,
        },
      })
      .from(postsTable)
      .leftJoin(author, eq(postsTable.authorId, author.id))
      .where(
        query
          ? sql`(${postsTable.title} ilike ${`%${query}%`} 
            or ${postsTable.content} ilike ${`%${query}%`})
            or ${author.name} ilike ${`%${query}%`} `
          : undefined
      )
  );

  const [[{ count }], posts] = await Promise.all([
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
    posts: posts as PostSerialized[],
  });
};

export default function PostsPage() {
  const { posts, totalPages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  let currentPage = Number(searchParams.get('page') ?? 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex items-center justify-between gap-2">
        <Search placeholder="Search posts..." />
        <CreateBtnLink to="new" title="New Post" />
      </div>
      <TableContainer totalPages={totalPages} currentPage={currentPage}>
        <MobileTable>
          {posts?.map(post => (
            <div key={post.id} className="mb-2 w-full rounded-md bg-base-100 p-4">
              <div className="flex items-center justify-between border-b pb-4 gap-4">
                <div>
                  <div className="mb-2 flex items-center">
                    <p>{post.title}</p>
                  </div>
                  <p className="text-sm text-gray-500">{post.author.username}</p>
                </div>
                <span className="text-xs min-w-fit">
                  {formatDateToLocal(post.createdAt)}
                </span>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div>
                  <p className="text-sm line-clamp-3">{post.content}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <UpdateBtnLink to={`${post.id}/edit`} />
                  <DeleteBtnLink
                    to={`${post.id}/delete`}
                    title="Delete Post"
                    recordName={post.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </MobileTable>
        <ResponsiveTable headers={['Title', 'Author', 'Content', 'Created At']}>
          {posts?.map(post => (
            <tr
              key={post.id}
              className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
            >
              <td className="flex-1">
                <p className="line-clamp-2">{post.title}</p>
              </td>
              <td className="flex-1 whitespace-nowrap">{post.author.name}</td>
              <td className="flex-1">
                <p className="line-clamp-2 max-w-sm">{post.content}</p>
              </td>
              <td className="whitespace-nowrap px-3 py-3">
                {formatDateToLocal(post.createdAt)}
              </td>
              <td className="flex-1 whitespace-nowrap">
                <div className="flex justify-end gap-3">
                  <UpdateBtnLink to={`${post.id}/edit`} />
                  <DeleteBtnLink
                    to={`${post.id}/delete`}
                    title="Delete Post"
                    recordName={post.title}
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
