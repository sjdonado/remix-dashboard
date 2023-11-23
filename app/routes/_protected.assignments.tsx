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

  const [adminRole, teacherRole] = userRoles.enumValues;
  if (![adminRole, teacherRole].includes(role)) {
    return redirect('/');
  }

  return json({});
};

export default function AssignmentsLayout() {
  const location = useLocation();
  const pageTitle = location.pathname.split('/').pop()!;

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Assignments',
            href: '/assignments',
            active: pageTitle === 'assignments',
          },
          ...(pageTitle === 'new'
            ? [
                {
                  label: 'New',
                  href: '/assignments/new',
                  active: true,
                },
              ]
            : []),
          ...(pageTitle === 'edit'
            ? [
                {
                  label: 'Edit',
                  href: '/assignments/edit',
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
