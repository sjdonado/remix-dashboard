import { v4 as uuidv4 } from 'uuid';

import { faker } from '@faker-js/faker';

import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import type { User } from '~/schemas/user';
import { assignmentsTable, userRoles, userRolesTable, usersTable } from './schema';

import Password from '~/utils/password.server';

export const seedUsers = async (db: BetterSQLite3Database) => {
  const data: User[] = [];
  const password = await Password.hash('123456');

  await db.insert(userRolesTable).values(userRoles.map(role => ({ id: role })));

  for (let i = 0; i < 50; i++) {
    const role = i % 2 === 0 ? userRoles[0] : userRoles[1];

    data.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: `${role === userRoles[0] ? 'admin' : 'teacher'}${i + 1}`,
      password,
      role,
    } as User);
  }

  for (let i = 0; i < 10; i++) {
    data.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: `student${i + 1}`,
      password,
      role: userRoles[2],
    } as User);
  }

  const result = await db
    .insert(usersTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return result;
};

export const seedAssignments = async (db: BetterSQLite3Database, users: User[]) => {
  const data = [];

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      data.push({
        id: uuidv4(),
        authorId: user.id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(16, '\n'),
      });
    }
  }

  const result = await db
    .insert(assignmentsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return result;
};
