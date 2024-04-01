import { eq } from 'drizzle-orm';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import { jsonWithSuccess } from 'remix-toast';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import { UserUpdateSchema } from '~/schemas/user';

import { isAuthenticated } from '~/services/auth.server';

import { Input } from '~/components/forms/Input';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import { Breadcrumb, Breadcrumbs } from '~/components/Breadcrumbs';
import UserRoleSelect from '~/components/select/UserRoleSelect';

const validator = withZod(UserUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => (
    <Breadcrumb pathname={match.pathname} label="My Profile" />
  ),
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userSession = await isAuthenticated(request);

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { username, role } = fieldValues.data;

  await db
    .update(usersTable)
    .set({ username, role })
    .where(eq(usersTable.id, userSession.id));

  return jsonWithSuccess({}, 'Profile updated successfully');
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await isAuthenticated(request);

  const [user] = await db
    .select({
      username: usersTable.username,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userSession.id))
    .limit(1);

  return json({ user });
};

export default function MePage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs />
      <ValidatedForm validator={validator} method="post">
        <div className="rounded-lg border border-base-300 bg-base-200/30 p-4 md:p-6">
          <Input
            name="username"
            label="Username"
            type="text"
            placeholder="Your username"
            defaultValue={user.username}
            icon={<IdentificationIcon className="form-input-icon" />}
          />
          <UserRoleSelect name="role" defaultValue={user.role} />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <BackButton message="Back" />
          <SubmitButton message="Save" />
        </div>
      </ValidatedForm>
    </div>
  );
}
