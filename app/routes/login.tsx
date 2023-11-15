import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import {
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";

import { auth, sessionStorage } from "~/actions/auth.server";

import { UserLoginSchema } from "~/schemas/user";
import { FormInput } from "~/components/FormInput";

const validator = withZod(UserLoginSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await validator.validate(
    await request.clone().formData(), // only if FormStrategy is used otherwise request.formData() is ok
  );

  if (data.error) {
    return validationError(data.error);
  }

  await auth.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

type LoaderError = { message: string } | null;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await auth.isAuthenticated(request, { successRedirect: "/" });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const loginError = session.get(auth.sessionErrorKey) as LoaderError;

  return json({ loginError });
};

export default function Login() {
  const { loginError } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Login</h2>
          <ValidatedForm validator={validator} method="post">
            <FormInput name="email" label="Email" type="email" placeholder="Your email" />
            <FormInput name="password" label="Password" type="password" placeholder="Your password" />
            {loginError && <div className="text-red-500 mt-2 text-center">{loginError.message}</div>}
            <button className="btn btn-accent mt-4 w-full" type="submit">Login</button>
          </ValidatedForm>
          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
