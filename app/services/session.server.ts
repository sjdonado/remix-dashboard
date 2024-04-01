import type { SessionData } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';

import { UserSessionSchema, type UserSession } from '~/schemas/user';

import { HOST, SECRET_KEY } from '~/config/env.server';

export const COOKIES_DEFAULTS = {
  name: '__user_session',
  domain: HOST,
  path: '/',
  sameSite: 'Lax' as const,
  httpOnly: true,
  secrets: [SECRET_KEY],
  secure: process.env.NODE_ENV === 'production',
};

export const userSessionStorage = createCookieSessionStorage({
  cookie: {
    ...COOKIES_DEFAULTS,
  } as SessionData,
});

export const getUserSessionData = async (request: Request) => {
  const userSession = await userSessionStorage.getSession(request.headers.get('Cookie'));

  const user = userSession.get('user');

  if (!user) {
    return;
  }

  const serializedSession = await UserSessionSchema.parseAsync(user);

  return serializedSession;
};

export const updateUserSessionData = async (
  request: Request,
  update: Partial<UserSession>
) => {
  const userSession = await userSessionStorage.getSession(request.headers.get('Cookie'));

  const user = userSession.get('user') as UserSession;
  userSession.set('user', Object.assign(user ?? {}, update));

  return userSessionStorage.commitSession(userSession);
};

export const { getSession, commitSession } = userSessionStorage;
