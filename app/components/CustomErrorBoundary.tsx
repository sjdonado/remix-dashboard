import clsx from 'clsx';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

import { useNavigate, useRouteError } from '@remix-run/react';

interface CustomErrorBoundaryProps {
  className?: string;
}

export function CustomErrorBoundary({ className }: CustomErrorBoundaryProps) {
  const navigate = useNavigate();

  const error = useRouteError() as Error;
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
      <p className="mx-4 mb-4 text-center text-sm text-error">Details: {error.message}</p>
      <button
        className="btn btn-outline btn-error btn-sm rounded-lg"
        type="button"
        onClick={() => navigate(-1)}
      >
        Go back to previous page
      </button>
    </div>
  );
}
