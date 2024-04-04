import { getToast } from 'remix-toast';
import { Toaster, toast as notify } from 'sonner';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from '@remix-run/react';
import { useEffect } from 'react';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import '~/index.css';

import LoadingBar from './components/LoadingBar';
import { CustomErrorBoundary } from './components/CustomErrorBoundary';

export function useRouteData<T>(routeId: string): T {
  const matches = useMatches();

  const data = matches.find(match => match.id === routeId)?.data;

  if (!data) {
    throw new Error(`Route ${routeId} does not exist`);
  }

  return data as T;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);

  return json({ toast }, { headers });
};

export default function App() {
  const { toast } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast?.type === 'error') {
      notify.error(toast.message);
    }
    if (toast?.type === 'success') {
      notify.success(toast.message);
    }
  }, [toast]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dashboard</title>
        <meta
          name="description"
          content="MVP of a Learning Management System built with remix + vite, drizzle + better-sqlite3, and tailwindcss + daisyui"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <LoadingBar />
        <Outlet />
        <Toaster closeButton />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <CustomErrorBoundary className="h-screen w-full" />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
