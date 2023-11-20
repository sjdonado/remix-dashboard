import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { AuthorizationError } from 'remix-auth';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { auth } from '~/session.server';

import { UserLoginSchema } from '~/schemas/user';
import { FormInput } from '~/components/FormInput';

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await auth.isAuthenticated(request, { successRedirect: '/' });

  return json({});
};

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600">
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <div className="card-body">
          <h2 className="card-title mb-4">Login</h2>
          <ValidatedForm validator={validator} method="post">
            <FormInput
              name="username"
              label="Username"
              type="username"
              placeholder="Your username"
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Your password"
            />
            <button className="btn btn-accent mt-4 w-full" type="submit">
              Login
            </button>
          </ValidatedForm>
          <div className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
