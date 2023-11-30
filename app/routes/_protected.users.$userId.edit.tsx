import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import {
  IdentificationIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { redirectWithToast } from 'remix-toast';
import type { DatabaseError } from 'pg';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { duplicateUsernameError } from '~/errors/form.server';

import { db } from '~/db/config.server';
import { userRoles, usersTable } from '~/db/schema';
import type { AppUserSession } from '~/schemas/session';
import { UserUpdateSchema } from '~/schemas/user';

import { Breadcrumb } from '~/components/Breadcrumbs';
import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import { useRouteData } from '~/root';

const validator = withZod(UserUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Edit" />,
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const { searchParams } = new URL(request.url);

  const fieldValues = await validator.validate(await request.formData());

  console.log({ fieldValues });
  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { name, username, role } = fieldValues.data;

  try {
    await db
      .update(usersTable)
      .set({ name, username, role, updatedAt: new Date().toISOString() })
      .where(eq(usersTable.id, params.userId));
  } catch (error) {
    const validationError = duplicateUsernameError(error as DatabaseError, fieldValues);
    if (validationError) return validationError;

    throw error;
  }

  return redirectWithToast(`/users?${searchParams.toString()}`, {
    message: 'User updated successfully',
    type: 'success',
  });
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
  const userSession = useRouteData<AppUserSession>('routes/_protected');

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
          disabled={userSession?.role === user.role}
          icon={
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        >
          <option value="" disabled>
            Select a role
          </option>
          {userRoles.map(role => (
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
