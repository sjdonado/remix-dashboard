import { eq } from 'drizzle-orm';

import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

import Password from '~/utils/password';

import { db } from '~/db/config.server';
import { users } from '~/db/schema.server';

import { SESSION_SECRET } from '~/config/env';

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
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!(user && (await Password.compare(password, user.password)))) {
      throw new AuthorizationError('Invalid credentials');
    }

    return username;
  })
);
