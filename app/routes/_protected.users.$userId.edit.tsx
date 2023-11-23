import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import {
  IdentificationIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { redirectWithSuccess } from 'remix-toast';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { userRoles, usersTable } from '~/db/schema';
import { UserUpdateSchema } from '~/schemas/user';

import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';

const validator = withZod(UserUpdateSchema);

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const { searchParams } = new URL(request.url);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { name, username, role } = fieldValues.data;

  await db
    .update(usersTable)
    .set({ name, username, role, updatedAt: new Date() })
    .where(eq(usersTable.id, params.userId));

  return redirectWithSuccess(
    `/users?${searchParams.toString()}`,
    'User updated successfully'
  );
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');

  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.id, params.userId))
    .limit(1);

  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ user });
};

export default function EditUserPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg bg-base-200/30 p-4 md:p-6">
        <Input
          name="name"
          label="Name"
          type="text"
          placeholder="Your name"
          defaultValue={user.name}
          icon={
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="Your username"
          defaultValue={user.username}
          icon={
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Select
          id="role"
          name="role"
          label="Choose role"
          defaultValue={user.role}
          icon={
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
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
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Edit User" />
      </div>
    </ValidatedForm>
  );
}
