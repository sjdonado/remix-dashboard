import { redirect } from '@remix-run/node';

import type { UserRole } from '~/constants/user';
import { getUserSessionData } from './session.server';
import type { UserSession } from '~/schemas/user';

export async function isAuthorized(
  request: Request,
  allowedRoles: UserRole[],
  failureRedirect = '/unauthorized'
): Promise<UserSession> {
  const userSession = await getUserSessionData(request);

  if (!userSession) {
    throw redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`);
  }

  if (!allowedRoles.includes(userSession.role)) {
    throw redirect(failureRedirect);
  }

  return userSession;
}
