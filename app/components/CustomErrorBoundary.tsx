import { useRouteError } from '@remix-run/react';

export function CustomErrorBoundary() {
  const error = useRouteError() as Error;
  console.log(error);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-error/10 w-full h-[80vh]">
      <h2 className="text-error text-xl font-semibold">Oh snap! There was an error</h2>
      <p className="text-error text-sm">Error message: {error.message}</p>
    </div>
  );
}
