import { getToast } from 'remix-toast';
import { Toaster, toast as notify } from 'sonner';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useEffect } from 'react';

import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import '~/tailwind.css';

import LoadingBar from './components/LoadingBar';

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
        <Meta />
        <Links />
      </head>
      <body>
        <LoadingBar />
        <Outlet />
        <Toaster closeButton />

        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
