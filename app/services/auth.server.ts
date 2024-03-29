import { redirect } from '@remix-run/node';

import type { UserRole } from '~/constants/user';

import { getUserSessionData, updateUserSessionData } from './session.server';
import type { UserSession } from '~/schemas/user';

export const authenticate = async (
  request: Request,
  sessionData: Partial<UserSession>,
  redirectTo?: string | null
) => {
  return redirect(redirectTo || '/', {
    headers: {
      'Set-Cookie': await updateUserSessionData(request, sessionData),
    },
  });
};

export async function isAuthenticated(request: Request, failureRedirect?: string) {
  const userSession = await getUserSessionData(request);

  if (!userSession) {
    throw redirect(
      failureRedirect ?? `/login?redirectTo=${encodeURIComponent(request.url)}`
    );
  }

  return userSession!;
}

export async function isAuthorized(
  request: Request,
  allowedRoles: UserRole[],
  failureRedirect = '/unauthorized'
) {
  const userSession = await getUserSessionData(request);

  if (!userSession) {
    throw redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`);
  }

  if (!allowedRoles.includes(userSession.role)) {
    throw redirect(failureRedirect);
  }

  return userSession!;
}
