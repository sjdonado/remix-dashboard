import invariant from 'tiny-invariant';
import { eq } from 'drizzle-orm';
import { redirectWithToast } from 'remix-toast';

import { type ActionFunctionArgs } from '@remix-run/node';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const { searchParams } = new URL(request.url);

  await db.delete(usersTable).where(eq(usersTable.id, params.userId));

  return redirectWithToast(`/users?${searchParams.toString()}`, {
    message: 'User deleted successfully',
    type: 'success',
  });
};
