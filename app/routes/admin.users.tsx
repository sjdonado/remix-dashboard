import { Outlet, useLocation } from '@remix-run/react';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import Breadcrumbs from '~/components/Breadcrumbs';

export default function AdminUsersLayout() {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop()!;

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Users',
            href: '/admin/users',
            active: pageTitle === 'users',
          },
          ...(pageTitle === 'create'
            ? [
                {
                  label: 'Create User',
                  href: '/admin/users/create',
                  active: true,
                },
              ]
            : []),
          ...(pageTitle === 'edit'
            ? [
                {
                  label: 'Edit User',
                  href: '/admin/users/edit',
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
  return <CustomErrorBoundary />;
}
