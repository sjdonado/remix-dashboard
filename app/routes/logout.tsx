import type { ActionFunctionArgs } from '@remix-run/node';

import { auth } from '~/actions/auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await auth.logout(request, { redirectTo: '/login' });
};
