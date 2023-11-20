import type { ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import Password from '~/utils/password';

import { auth } from '~/session.server';

import { UserSignupSchema } from '~/schemas/user';

import { db } from '~/db/config.server';
import { users } from '~/db/schema';

import { FormInput } from '~/components/FormInput';

const validator = withZod(UserSignupSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    return validationError(fieldValues.error);
  }

  const { name, username } = fieldValues.data;

  const password = await Password.hash(fieldValues.data.password);

  try {
    await db.insert(users).values({ name, username, password });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'UNIQUE constraint failed: users.username'
    ) {
      return validationError(
        {
          fieldErrors: {
            username: 'This username is already taken',
          },
          formId: fieldValues.formId,
        },
        fieldValues.data
      );
    }

    return json({ error: 'Something went wrong' }, { status: 500 });
  }

  return redirect('/login');
};

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: '/' });

  return json({});
};

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Signup</h2>
          <ValidatedForm validator={validator} method="post">
            <FormInput
              name="username"
              label="Username"
              type="username"
              placeholder="Your username"
            />
            <FormInput name="name" label="Name" type="text" placeholder="Your name" />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Your password"
            />
            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />
            <button className="btn btn-accent mt-4 w-full" type="submit">
              Signup
            </button>
          </ValidatedForm>
          <div className="mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
