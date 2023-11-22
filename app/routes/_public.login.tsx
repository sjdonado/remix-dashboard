import { LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { UserLoginSchema } from '~/schemas/user';

import { auth } from '~/session.server';

import { Input } from '~/components/forms/Input';

const validator = withZod(UserLoginSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await validator.validate(
    await request.clone().formData() // only if FormStrategy is used otherwise request.formData() is ok
  );

  if (data.error) return validationError(data.error);

  try {
    await auth.authenticate('form', request, {
      successRedirect: '/',
      throwOnError: true,
    });
  } catch (err) {
    if (err instanceof Response) return err;

    if (err instanceof AuthorizationError) {
      return validationError({
        fieldErrors: {
          username: 'Invalid username or password',
          password: 'Invalid username or password',
        },
        formId: data.formId,
      });
    }
    return json({ error: 'Something went wrong' }, { status: 500 });
  }
};

export default function LoginPage() {
  return (
    <div className="card-body">
      <h2 className="card-title mb-4">Login</h2>
      <ValidatedForm validator={validator} method="post">
        <Input
          name="username"
          label="Username"
          type="username"
          placeholder="Your username"
          icon={
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-content" />
          }
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          icon={
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-content" />
          }
        />
        <button className="btn bg-primary rounded-lg mt-4 w-full" type="submit">
          Login
        </button>
      </ValidatedForm>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="underline">
          Create one
        </Link>
      </div>
    </div>
  );
}
