import clsx from 'clsx';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

interface CustomErrorBoundaryProps {
  className?: string;
}

export function CustomErrorBoundary({ className }: CustomErrorBoundaryProps) {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4 rounded-lg bg-error/10',
        className
      )}
    >
      <FaceFrownIcon className="size-16 text-error" />
      <h2 className="text-xl font-semibold text-error">Oh snap! Something went wrong</h2>
      <p className="mx-4 mb-4 text-center text-sm text-error">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : 'Unknown Error'}
      </p>
      <a href="/" className="btn btn-outline btn-error btn-sm rounded-lg">
        Back to Home
      </a>
    </div>
  );
}
