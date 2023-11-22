import { useRouteError } from '@remix-run/react';

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  console.log(error);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md bg-red-50 w-full h-[80vh]">
      <h2 className="text-red-600 text-xl font-semibold">Oh snap! There was an error</h2>
      <p className="text-red-600 text-sm">Error message: {error.message}</p>
    </div>
  );
}
