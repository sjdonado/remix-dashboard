import type { UIMatch } from '@remix-run/react';
import { Outlet } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

import { getSessionData } from '~/utils/session.server';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import { Breadcrumb, Breadcrumbs } from '~/components/Breadcrumbs';

export const handle = {
  breadcrumb: (match: UIMatch) => (
    <Breadcrumb pathname={match.pathname} label="Assignments" />
  ),
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { isAdmin, isTeacher } = await getSessionData(request);

  if (!isAdmin && !isTeacher) {
    return redirect('/');
  }

  return json({
    isAdmin,
    isTeacher,
  });
};

export default function AssignmentsLayout() {
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
