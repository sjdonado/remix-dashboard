import { Outlet } from '@remix-run/react';
import { type LoaderFunctionArgs } from '@remix-run/node';

import { isAuthorized } from '~/services/auth.server';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import { UserRole } from '~/constants/user';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isAuthorized(request, [UserRole.Admin, UserRole.Student], '/assignments');

  return null;
};

export default function AssignmentsLayout() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="h-[90vh] w-full" />;
}
