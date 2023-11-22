import { Link, useSearchParams } from '@remix-run/react';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export function CreateUserBtnLink() {
  return (
    <Link
      to="/admin/users/create"
      className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors 
      hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <span className="hidden md:block">Create User</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateUserBtnLink({ id }: { id: string }) {
  const [searchParams] = useSearchParams();

  return (
    <Link
      to={`/admin/users/${id}/edit?${searchParams.toString()}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUserBtnLink({ id }: { id: string }) {
  return (
    <form method="post" action={`/admin/users/${id}/delete`}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
