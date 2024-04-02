import type { UIMatch } from '@remix-run/react';
import { Outlet } from '@remix-run/react';
import { type LoaderFunctionArgs } from '@remix-run/node';

import { UserRole } from '~/constants/user';

import { isAuthorized } from '~/services/auth.server';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import { Breadcrumb, Breadcrumbs } from '~/components/Breadcrumbs';

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Home" />,
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isAuthorized(request, [UserRole.Admin, UserRole.Student], '/assignments');

  return null;
};

export default function HomeLayout() {
  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs />
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="h-[90vh] w-full" />;
}
