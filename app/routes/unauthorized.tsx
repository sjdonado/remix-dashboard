import type { MetaFunction } from '@remix-run/node';
import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';

export const meta: MetaFunction = () => {
  return [{ title: 'Unauthorized' }];
};

export const loader = async () => {
  throw new Error(
    'You might not have access to this page. Please contact support if you think this is an error.'
  );
};

export default function Unauthorized() {
  return null;
}

export function ErrorBoundary() {
  return <CustomErrorBoundary className="h-screen w-full" />;
}
