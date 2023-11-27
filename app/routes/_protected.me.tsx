import { eq } from 'drizzle-orm';
import {
  IdentificationIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { jsonWithSuccess } from 'remix-toast';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { UIMatch } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import { UserMeUpdateSchema } from '~/schemas/user';

import { auth } from '~/services/auth.server';

import { Input } from '~/components/forms/Input';
import BackButton from '~/components/forms/BackButton';
import SubmitButton from '~/components/forms/SubmitButton';
import { Breadcrumb, Breadcrumbs } from '~/components/Breadcrumbs';

const validator = withZod(UserMeUpdateSchema);

export const handle = {
  breadcrumb: (match: UIMatch) => (
    <Breadcrumb pathname={match.pathname} label="My Profile" />
  ),
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user: userSession } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { name, username } = fieldValues.data;

  await db
    .update(usersTable)
    .set({ name, username, updatedAt: new Date() })
    .where(eq(usersTable.id, userSession.id));

  return jsonWithSuccess({}, 'Profile updated successfully');
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user: userSession } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const [user] = await db
    .select({
      name: usersTable.name,
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
          <Input
            id="role"
            name="role"
            label="Your role"
            defaultValue={user.role}
            disabled
            icon={
              <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
            }
          ></Input>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <BackButton message="Go back" />
          <SubmitButton message="Save" />
        </div>
      </ValidatedForm>
    </div>
  );
}
