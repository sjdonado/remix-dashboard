import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import type { UserSession } from '~/schemas/user';

import { userRoles } from '~/db/schema';

import { auth } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await auth.isAuthenticated(request);

  const { role } = JSON.parse(userSession!) satisfies UserSession;

  if (role === userRoles.enumValues[0]) {
    return redirect('/admin');
  }

  if (role === userRoles.enumValues[1]) {
    return redirect('/teacher');
  }

  return redirect('/student');
};
