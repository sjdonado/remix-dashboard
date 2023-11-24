import { Outlet } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';

import { getSessionData } from '~/utils/session';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { isAdmin, isStudent } = await getSessionData(request);

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
