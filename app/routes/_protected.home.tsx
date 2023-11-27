import { Outlet } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

import { auth } from '~/services/auth.server';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { isAdmin, isStudent } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  if (!isAdmin && !isStudent) {
    return redirect('/assignments');
  }

  return json({});
};

export default function AssignmentsLayout() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="w-full h-[90vh]" />;
}
