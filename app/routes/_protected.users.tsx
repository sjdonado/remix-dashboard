import { Outlet, useLocation } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

import { getSessionData } from '~/utils/session.server';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import Breadcrumbs from '~/components/Breadcrumbs';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { isAdmin } = await getSessionData(request);

  if (!isAdmin) {
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
