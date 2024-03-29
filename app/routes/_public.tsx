import { Outlet } from '@remix-run/react';

import AppLogo from '~/components/AppLogo';
import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200/50 p-4">
      <div className="flex items-center p-auto bg-primary rounded-md w-full h-32 sm:w-96">
        <AppLogo />
      </div>
      <div className="card rounded-md w-full bg-base-100 shadow-xl m-4 sm:w-96">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="w-full h-full" />;
}
