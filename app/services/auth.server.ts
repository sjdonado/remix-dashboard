import { eq } from 'drizzle-orm';

import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import type { AppSession } from '~/schemas/session';

import { SESSION_SECRET } from '~/config/env.server';

import Password from '~/utils/password.server';
import { UserRole } from '~/constants/user';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const auth = new Authenticator<AppSession>(sessionStorage);

auth.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username')!.toString();
    const password = form.get('password')!.toString();

    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        password: usersTable.password,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    const isPasswordValid = await Password.compare(password, user.password);

    if (!(user && isPasswordValid)) {
      throw new AuthorizationError('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      isAdmin: user.role === UserRole.Admin,
      isTeacher: user.role === UserRole.Teacher,
      isStudent: user.role === UserRole.Student,
    };
  })
);

// export async function isAuthorized(
//   request: Request,
//   allowedRoles: UserRole[],
//   failureRedirect = '/unauthorized'
// ): Promise<UserSession> {
//   const userSession = await getUserSessionData(request);
//
//   if (!userSession) {
//     throw redirect(`/login?redirectTo=${encodeURIComponent(request.url)}`);
//   }
//
//   if (!allowedRoles.includes(userSession.role)) {
//     throw redirect(failureRedirect);
//   }
//
//   return userSession;
// }

export const { getSession, commitSession, destroySession } = sessionStorage;
