import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Link, useSearchParams } from '@remix-run/react';

import Pagination from './Pagination';
import { DialogModalButton } from './dialog/ConfirmationDialog';

interface TableProps {
  totalPages: number;
  currentPage: number;
  children: React.ReactNode;
}

export function TableContainer({ totalPages, currentPage, children }: TableProps) {
  if (totalPages === 0) return <p className="m-4 text-center">No results</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-block min-w-full align-middle">
        <div className="border-base-custom rounded-lg border bg-base-200/50 p-2 md:pt-0">
          {children}
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

export function MobileTable({ children }: { children: React.ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}

export function ResponsiveTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="hidden min-w-full md:table">
      <thead className="rounded-lg text-left">
        <tr>
          {headers.map(header => (
            <th key={header} scope="col" className="px-4 py-5 text-sm">
              {header}
            </th>
          ))}
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-base-100">{children}</tbody>
    </table>
  );
}

export function ShowBtnLink({ to }: { to: string }) {
  const [searchParams] = useSearchParams();

  return (
    <Link
      to={`${to}?${searchParams.toString()}`}
      className="rounded-lg border p-2 hover:bg-base-200"
    >
      <EyeIcon className="size-5" />
    </Link>
  );
}

export function CreateBtnLink({ to, title }: { to: string; title: string }) {
  return (
    <Link
      to={to}
      className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-content"
    >
      <PlusIcon className="size-5" />
      <span className="hidden md:block">{title}</span>
    </Link>
  );
}

export function UpdateBtnLink({ to }: { to: string }) {
  const [searchParams] = useSearchParams();

  return (
    <Link
      to={`${to}?${searchParams.toString()}`}
      className="border-base-custom rounded-lg border p-2 hover:bg-base-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBtnLink({
  to,
  title,
  recordName,
}: {
  to: string;
  title: string;
  recordName: string;
}) {
  const [searchParams] = useSearchParams();

  return (
    <DialogModalButton
      title="Delete User"
      description={`Are you sure you want to delete ${recordName}?`}
      button="Delete"
      method="post"
      action={`${to}?${searchParams.toString()}`}
      className="border-base-custom rounded-lg border p-2 hover:bg-base-200"
    >
      <span className="sr-only">{title}</span>
      <TrashIcon className="w-5" />
    </DialogModalButton>
  );
}
