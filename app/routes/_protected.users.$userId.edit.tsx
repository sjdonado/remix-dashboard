import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import { redirectWithToast } from 'remix-toast';
import type { SqliteError } from 'better-sqlite3';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import type { UserSession } from '~/schemas/user';
import { UserUpdateSchema } from '~/schemas/user';

import { type UserRole } from '~/constants/user';
import { duplicateUsernameError } from '~/errors/form.server';

import { useRouteData } from '~/root';

import { Breadcrumb } from '~/components/Breadcrumbs';
import { Input } from '~/components/forms/Input';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import UserRoleSelect from '~/components/select/UserRoleSelect';

const validator = withZod(UserUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Edit" />,
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const { searchParams } = new URL(request.url);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { username, role } = fieldValues.data;

  try {
    await db
      .update(usersTable)
      .set({
        username,
        role: role as UserRole,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(usersTable.id, params.userId));
  } catch (error) {
    const validationError = duplicateUsernameError(error as SqliteError, fieldValues);
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
  const userSession = useRouteData<UserSession>('routes/_protected');

  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg border border-base-300 bg-base-200/50 p-4 md:p-6">
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="Your username"
          defaultValue={user.username}
          icon={<IdentificationIcon className="form-input-icon" />}
        />
        <UserRoleSelect
          name="role"
          defaultValue={user.role}
          disabled={userSession.role === user.role}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Edit User" />
      </div>
    </ValidatedForm>
  );
}
