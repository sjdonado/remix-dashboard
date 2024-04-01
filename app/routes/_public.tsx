import { Outlet } from '@remix-run/react';

import AppLogo from '~/components/AppLogo';
import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200/30 p-4">
      <div className="flex h-32 w-full items-center justify-center rounded-md bg-primary sm:w-96">
        <AppLogo className="text-3xl text-white" />
      </div>
      <div className="card m-4 w-full rounded-md bg-base-100 shadow-xl sm:w-96">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="size-full" />;
}
