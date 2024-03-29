import { IdentificationIcon, KeyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { redirectWithToast } from 'remix-toast';
import type { SqliteError } from 'better-sqlite3';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import type { UIMatch } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/node';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import { UserCreateSchema } from '~/schemas/user';

import type { UserRole } from '~/constants/user';
import { ALL_USER_ROLES } from '~/constants/user';

import { duplicateUsernameError } from '~/errors/form.server';

import { Breadcrumb } from '~/components/Breadcrumbs';
import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';

const validator = withZod(UserCreateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => <Breadcrumb pathname={match.pathname} label="Create" />,
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { username, role } = fieldValues.data;

  try {
    await db.insert(usersTable).values({ username, role: role as UserRole });
  } catch (error) {
    const validationError = duplicateUsernameError(error as SqliteError, fieldValues);
    if (validationError) return validationError;

    throw error;
  }

  return redirectWithToast('/users', {
    message: 'User created successfully',
    type: 'success',
  });
};

export default function CreateUserPage() {
  return (
    <ValidatedForm validator={validator} method="post">
      <div className="rounded-lg bg-base-200/30 p-4 md:p-6">
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="Username"
          icon={
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Select
          id="role"
          name="role"
          label="Choose role"
          icon={
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        >
          <option value="" disabled>
            Select a role
          </option>
          {ALL_USER_ROLES.map(role => (
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
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <BackButton message="Cancel" />
        <SubmitButton message="Save" />
      </div>
    </ValidatedForm>
  );
}
