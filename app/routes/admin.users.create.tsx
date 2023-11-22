import { v4 as uuidv4 } from 'uuid';

import {
  IdentificationIcon,
  KeyIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { db } from '~/db/config.server';
import { userRoles, usersTable } from '~/db/schema';
import { UserCreateSchema } from '~/schemas/user';

import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';

import Password from '~/utils/password';

const validator = withZod(UserCreateSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { name, username, role } = fieldValues.data;
  const password = await Password.hash(fieldValues.data.password);

  try {
    await db.insert(usersTable).values({ id: uuidv4(), name, username, role, password });
  } catch (error) {
    return json({ error: 'Something went wrong' }, { status: 500 });
  }

  return redirect('/admin/users');
};

export default function CreateUser() {
  const navigate = useNavigate();

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Input
          name="name"
          label="Name"
          type="text"
          placeholder="Name"
          icon={
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          }
        />
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="Username"
          icon={
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          }
        />
        <Select
          id="role"
          name="role"
          label="Choose role"
          icon={
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          }
        >
          <option value="" disabled>
            Select a role
          </option>
          {userRoles.enumValues.map(role => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          icon={
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          }
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          onClick={() => navigate(-1)}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          type="submit"
        >
          Create User
        </button>
      </div>
    </ValidatedForm>
  );
}
