import { eq } from 'drizzle-orm';
import { parse } from 'cookie';
import type { Cookie } from 'playwright/test';

import { db } from '~/db/config.server';
import { userRoles, usersTable } from '~/db/schema';

import { commitSession, getSession } from '~/services/auth.server';
import type { AppSession } from '~/schemas/session';

export const VALID_ADMIN_USERNAME = 'admin1';
export const VALID_TEACHER_USERNAME = 'teacher2';
export const VALID_STUDENT_USERNAME = 'student1';

export const VALID_PASSWORD = '123456';

export const ADMIN_STORAGE_STATE = 'tests/.auth/admin.json';
export const TEACHER_STORAGE_STATE = 'tests/.auth/teacher.json';
export const STUDENT_STORAGE_STATE = 'tests/.auth/student.json';

export const mockUserSession = async (username: string) => {
  const session = await getSession();

  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  session.set('strategy', 'form');
  session.set('user', {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
    isAdmin: user.role === userRoles[0],
    isTeacher: user.role === userRoles[1],
    isStudent: user.role === userRoles[2],
  });

  const cookies = await commitSession(session);

  return parse(cookies).__session;
};

export const getAppSession = async (cookies: Cookie[]) => {
  const session = await getSession(
    `__session=${cookies.find(cookie => cookie.name === '__session')?.value}`
  );
  return session.data.user as AppSession;
};
