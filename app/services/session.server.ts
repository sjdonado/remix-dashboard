import type { SessionData } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';

import { HOST, SECRET_KEY } from '~/config/env.server';

import type { UserSession } from '~/schemas/user';

export const COOKIES_DEFAULTS = {
  name: '__session',
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
    name: '__user_session',
  } as SessionData,
});

export const getUserSessionData = async (request: Request) => {
  const userSession = await userSessionStorage.getSession(request.headers.get('Cookie'));

  const data = userSession.get('data') as UserSession;

  return data;
};

export const updateUserSessionData = async (
  request: Request,
  update: Partial<UserSession>
) => {
  const userSession = await userSessionStorage.getSession(request.headers.get('Cookie'));

  const data = userSession.get('data') as UserSession;

  userSession.set('data', Object.assign(data ?? {}, update));

  return userSessionStorage.commitSession(userSession);
};
