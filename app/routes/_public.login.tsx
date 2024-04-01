import { UserCircleIcon } from '@heroicons/react/24/outline';

import { redirect, type ActionFunctionArgs } from '@remix-run/node';

import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';
import { UserLoginSchema } from '~/schemas/user';

import { logger } from '~/utils/logger.server';

import { getUserSessionData } from '~/services/session.server';

import { Input } from '~/components/forms/Input';
import { authenticate } from '~/services/auth.server';
import { eq } from 'drizzle-orm';
import { UserRole } from '~/constants/user';
import UserRoleSelect from '~/components/select/UserRoleSelect';

const validator = withZod(UserLoginSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const userSession = await getUserSessionData(request);

  if (userSession) {
    return redirect('/');
  }

  const fieldValues = await validator.validate(await request.formData());

  if (fieldValues.error) {
    logger.error(`[_public.login] ${JSON.stringify(fieldValues.error)}`);
    return validationError(fieldValues.error);
  }

  const { username, role, redirectTo } = fieldValues.data;

  await db.insert(usersTable).values({ username, role }).onConflictDoNothing();

  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  const session = {
    id: user.id,
    username: user.username,
    role: user.role,
    isAdmin: user.role === UserRole.Admin,
    isTeacher: user.role === UserRole.Teacher,
    isStudent: user.role === UserRole.Student,
  };

  return authenticate(request, session, redirectTo);
};

export default function LoginPage() {
  return (
    <div className="card-body">
      <h2 className="card-title mb-4">Login</h2>
      <ValidatedForm validator={validator} method="post">
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="Your username"
          icon={<UserCircleIcon className="form-input-icon" />}
        />
        <UserRoleSelect name="role" />
        <button
          className="btn mt-4 w-full rounded-lg bg-primary text-base-100"
          type="submit"
        >
          Login
        </button>
      </ValidatedForm>
    </div>
  );
}
