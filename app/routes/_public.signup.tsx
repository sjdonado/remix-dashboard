import { v4 as uuidv4 } from 'uuid';
import {
  IdentificationIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { DatabaseError } from 'pg';

import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import { UserSignupSchema } from '~/schemas/user';

import Password from '~/utils/password.server';
import { duplicateUsernameError } from '~/errors/form.server';

import { Input } from '~/components/forms/Input';

const validator = withZod(UserSignupSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { name, username } = fieldValues.data;
  const password = await Password.hash(fieldValues.data.password);

  try {
    await db.insert(usersTable).values({ id: uuidv4(), name, username, password });
  } catch (error) {
    const validationError = duplicateUsernameError(error as DatabaseError, fieldValues);
    if (validationError) return validationError;

    throw error;
  }

  return redirect('/login');
};

export default function SignupPage() {
  return (
    <div className="card-body">
      <h2 className="card-title mb-4">Signup</h2>
      <ValidatedForm validator={validator} method="post">
        <Input
          name="username"
          label="Username"
          type="username"
          placeholder="Your username"
          icon={
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Input
          name="name"
          label="Name"
          type="text"
          placeholder="Your name"
          icon={
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          icon={
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          }
        />
        <button
          className="btn btn-primary text-base-100 rounded-lg mt-4 w-full"
          type="submit"
        >
          Signup
        </button>
      </ValidatedForm>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
