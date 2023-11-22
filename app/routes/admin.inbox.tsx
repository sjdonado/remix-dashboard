import { CustomErrorBoundary } from '~/components/CustomErrorBoundary';

export default function Inbox() {
  throw new Error('Not implemented');
  return <p>Inbox Page</p>;
}

export function ErrorBoundary() {
  return <CustomErrorBoundary />;
}
