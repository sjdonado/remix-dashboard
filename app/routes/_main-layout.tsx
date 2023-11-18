import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { useState } from 'react';

import { auth } from '~/actions/auth.server';
import Header from '~/components/Header';

import Sidebar from '~/components/Sidebar';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const email = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ email });
};

export default function MainLayout() {
  const navigation = useNavigation();
  const { email } = useLoaderData<typeof loader>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header email={email} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 p-4 bg-gray-100
            ${
              navigation.state === 'loading'
                ? 'loading transition-opacity duration-1000'
                : 'transition-opacity duration-1000'
            }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
