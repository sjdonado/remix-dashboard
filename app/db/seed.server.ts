import { v4 as uuidv4 } from 'uuid';

import { faker } from '@faker-js/faker';

import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import type { User } from '~/schemas/user';
import { assignmentsTable, userRoles, userRolesTable, usersTable } from './schema';

import Password from '~/utils/password.server';
import { connectToDatabase } from './config.server';

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

export const seedAssignments = async (db: BetterSQLite3Database) => {
  const users = await db.select().from(usersTable);

  if (!users.length) {
    console.error('No users found');
    return [];
  }

  const data = [];

  for (const user of users) {
    for (let i = 0; i < 12; i++) {
      data.push({
        id: uuidv4(),
        authorId: user.id,
        title: faker.lorem.words(),
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

const main = async () => {
  const client = connectToDatabase();

  const db = drizzle(client);

  const args = process.argv.slice(2);

  if (args.includes('users') || args.includes('all')) {
    const users = await seedUsers(db);
    console.log('[seedUsers]', users, `Total: ${users.length}`);
  }

  if (args.includes('assignments') || args.includes('all')) {
    const assignments = await seedAssignments(db);
    console.log('[seedAssignments]', assignments, `Total: ${assignments.length}`);
  }

  client.close();
};

await main();
