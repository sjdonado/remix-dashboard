import { Outlet, useLocation } from '@remix-run/react';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import Breadcrumbs from '~/components/Breadcrumbs';

export default function AdminPostsLayout() {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop()!;

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Posts',
            href: '/admin/posts',
            active: pageTitle === 'posts',
          },
          ...(pageTitle === 'create'
            ? [
                {
                  label: 'Create Post',
                  href: '/admin/posts/create',
                  active: true,
                },
              ]
            : []),
          ...(pageTitle === 'edit'
            ? [
                {
                  label: 'Edit Post',
                  href: '/admin/posts/edit',
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
