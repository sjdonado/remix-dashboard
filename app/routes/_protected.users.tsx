import type { UIMatch } from '@remix-run/react';
import { Outlet } from '@remix-run/react';
import { type LoaderFunctionArgs } from '@remix-run/node';

import { isAuthorized } from '~/services/auth.server';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import { Breadcrumb, Breadcrumbs } from '~/components/Breadcrumbs';
import { UserRole } from '~/constants/user';

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Users" />,
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isAuthorized(request, [UserRole.Admin]);

  return null;
};

export default function UsersLayout() {
  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs />
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="w-full h-[90vh]" />;
}
