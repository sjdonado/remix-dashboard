import { redirect, type ActionFunctionArgs } from '@remix-run/node';

import { userSessionStorage } from '~/services/session.server';

export const loader = async ({ request }: ActionFunctionArgs) => {
  const userSession = await userSessionStorage.getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await userSessionStorage.destroySession(userSession),
    },
  });
};
