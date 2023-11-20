import { eq } from 'drizzle-orm';

import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import Password from '~/utils/password';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';

import { SESSION_SECRET } from '~/config/env';
import type { UserSession } from './schemas/user';

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

export const auth = new Authenticator<string>(sessionStorage);

auth.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username')!.toString();
    const password = form.get('password')!.toString();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    console.log(user);

    if (!(user && (await Password.compare(password, user.password)))) {
      throw new AuthorizationError('Invalid credentials');
    }

    const userSession: UserSession = {
      username: user.username,
      role: user.role,
    };

    return JSON.stringify(userSession);
  })
);
