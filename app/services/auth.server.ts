import { eq } from 'drizzle-orm';

import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import { SESSION_SECRET } from '~/config/env.server';

import Password from '~/utils/password.server';

import { db } from '~/db/config.server';
import { userRoles, usersTable } from '~/db/schema';
import type { AppSession } from '~/schemas/session';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
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
        username: usersTable.username,
        password: usersTable.password,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!(user && (await Password.compare(password, user.password)))) {
      throw new AuthorizationError('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      isAdmin: user.role === userRoles.enumValues[0],
      isTeacher: user.role === userRoles.enumValues[1],
      isStudent: user.role === userRoles.enumValues[2],
    };
  })
);
