import { eq } from 'drizzle-orm';
import { parse } from 'cookie';
import type { Cookie } from 'playwright/test';

import { db } from '~/db/config.server';
import { usersTable } from '~/db/schema';

import { UserRole } from '~/constants/user';
import { commitSession, getSession } from '~/services/session.server';
import type { UserSession } from '~/schemas/user';

export const VALID_ADMIN_USERNAME = 'admin1';
export const VALID_TEACHER_USERNAME = 'teacher2';
export const VALID_STUDENT_USERNAME = 'student1';

export const ADMIN_STORAGE_STATE = 'tests/.auth/admin.json';
export const TEACHER_STORAGE_STATE = 'tests/.auth/teacher.json';
export const STUDENT_STORAGE_STATE = 'tests/.auth/student.json';

export const mockUserSession = async (username: string) => {
  const session = await getSession();

  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  session.set('user', {
    id: user.id,
    username: user.username,
    role: user.role,
    isAdmin: user.role === UserRole.Admin,
    isTeacher: user.role === UserRole.Teacher,
    isStudent: user.role === UserRole.Student,
  });

  const cookies = await commitSession(session);

  return parse(cookies).__user_session;
};

export const getUserSession = async (cookies: Cookie[]) => {
  const session = await getSession(
    `__user_session=${cookies.find(cookie => cookie.name === '__user_session')?.value}`
  );

  return session.get('user') as UserSession;
};
