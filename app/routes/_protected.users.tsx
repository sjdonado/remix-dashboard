import { Outlet, useLocation } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import Breadcrumbs from '~/components/Breadcrumbs';

import { userRoles } from '~/db/schema';
import type { UserSession } from '~/schemas/user';

import { auth } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const { role } = JSON.parse(data) satisfies UserSession;

  const [adminRole] = userRoles.enumValues;
  if (role !== adminRole) {
    return redirect('/');
  }

  return json({});
};

export default function UsersLayout() {
  const location = useLocation();
  const pathName = location.pathname.split('/');

  const pageTitle = pathName.pop()!;
  const uuid = pathName.pop()!;

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Users',
            href: '/users',
            active: pageTitle === 'users',
          },
          ...(pageTitle === 'create'
            ? [
                {
                  label: 'Create',
                  href: '/users/create',
                  active: true,
                },
              ]
            : []),
          ...(pageTitle === 'edit'
            ? [
                {
                  label: 'Edit',
                  href: `/users/${uuid}/edit`,
                  active: true,
                },
              ]
            : []),
        ]}
      />
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="w-full h-[90vh]" />;
}
