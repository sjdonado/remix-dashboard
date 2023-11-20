import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';

import type { UserSession } from '~/schemas/user';

import { auth } from '~/session.server';

import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json(JSON.parse(userSession) satisfies UserSession);
};

export default function AdminLayout() {
  const navigation = useNavigation();
  const { username, role } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen">
      <Sidebar sessionRole={role}>
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
