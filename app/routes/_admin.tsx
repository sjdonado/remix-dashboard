import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';

import { auth } from '~/actions/auth.server';
import Header from '~/components/Header';

import Sidebar from '~/components/Sidebar';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const username = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ username });
};

export default function AdminLayout() {
  const navigation = useNavigation();
  const { username } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <Sidebar>
        <Header username={username} />
        <main
          className={`flex-1 p-4
            ${
              navigation.state === 'loading'
                ? 'opacity-25 transition-opacity duration-200 delay-200'
                : ''
            }`}
        >
          <Outlet />
        </main>
      </Sidebar>
    </div>
  );
}
