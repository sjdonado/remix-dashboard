import clsx from 'clsx';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';

import { auth } from '~/services/auth.server';

import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user: userSession } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json(userSession);
};

export default function ProtectedLayout() {
  const navigation = useNavigation();
  const { username, role } = useLoaderData<typeof loader>();

  const isLoading = navigation.state === 'loading';

  return (
    <div className="flex h-screen">
      <Sidebar userSessionRole={role}>
        <Header username={username} />
        <main
          className={clsx('flex-1 px-4 md:px-12', {
            'opacity-25 transition-opacity duration-200 delay-200': isLoading,
          })}
        >
          <Outlet />
        </main>
      </Sidebar>
    </div>
  );
}
