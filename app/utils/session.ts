import { userRoles } from '~/db/schema';
import type { UserSession } from '~/schemas/user';

import { auth } from '~/session.server';

export const getSessionData = async (request: Request) => {
  const data = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const userSession = JSON.parse(data) satisfies UserSession;

  return {
    userSession,
    isAdmin: userSession.role === userRoles.enumValues[0],
    isTeacher: userSession.role === userRoles.enumValues[1],
    isStudent: userSession.role === userRoles.enumValues[2],
  };
};
