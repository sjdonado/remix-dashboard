import clsx from 'clsx';

import { Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs, json } from '@remix-run/node';

import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';
import Breadcrumbs from '~/components/Breadcrumbs';

import { getSessionData } from '~/utils/session';

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
  const location = useLocation();
  const pathName = location.pathname.split('/');

  const { isAdmin, isTeacher } = useLoaderData<typeof loader>();

  const pageTitle = pathName.pop()!;
  const uuid = pathName.pop()!;

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs
        breadcrumbs={[
          {
            label: clsx({
              'My Assignments': isTeacher,
              Assignments: isAdmin,
            }),
            href: '/assignments',
            active: pageTitle === 'assignments',
          },
          ...(pageTitle === 'show'
            ? [
                {
                  label: 'Show Details',
                  href: `/assignments/${uuid}/show`,
                  active: true,
                },
              ]
            : []),
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
                  href: `/assignments/${uuid}/edit`,
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
