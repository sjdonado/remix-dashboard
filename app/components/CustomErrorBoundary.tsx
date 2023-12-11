import clsx from 'clsx';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

import { useNavigate, useRouteError } from '@remix-run/react';

import { logger } from '~/utils/logger.server';

interface CustomErrorBoundaryProps {
  className?: string;
}

export function CustomErrorBoundary({ className }: CustomErrorBoundaryProps) {
  const navigate = useNavigate();

  const error = useRouteError() as Error;
  logger.error(error);

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4 rounded-lg bg-error/10',
        className
      )}
    >
      <FaceFrownIcon className="w-16 h-16 text-error" />
      <h2 className="text-error text-xl font-semibold">Oh snap! There was an error</h2>
      <p className="text-error text-sm mb-4 mx-4 text-center">
        Error message: {error.message}
      </p>
      <button
        className="btn btn-outline btn-error rounded-lg btn-sm"
        type="button"
        onClick={() => navigate(-1)}
      >
        Go back
      </button>
    </div>
  );
}
