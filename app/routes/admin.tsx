import clsx from 'clsx';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';

import type { UserSession } from '~/schemas/user';

import { auth } from '~/session.server';

import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';
import { userRoles } from '~/db/schema';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const { username, role } = JSON.parse(data) satisfies UserSession;

  if (role !== userRoles.enumValues[0]) {
    redirect('/');
  }

  return json({ username, role });
};

export default function AdminLayout() {
  const navigation = useNavigation();
  const { username, role } = useLoaderData<typeof loader>();

  const isLoading = navigation.state === 'loading';

  return (
    <div className="flex h-screen">
      <Sidebar userSessionRole={role}>
        <Header username={username} />
        {isLoading ? (
          <div className="absolute top-0 left-64 right-0 bottom-0 flex items-center justify-center h-full transition-opacity delay-200 sm:left-72">
            <span className="absolute loading loading-dots loading-lg"></span>
          </div>
        ) : null}
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
