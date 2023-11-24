import 'dotenv/config';

import { faker } from '@faker-js/faker';

import postgres from 'postgres';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';

import type { User } from '~/schemas/user';
import { assignmentsTable, userRoles, usersTable } from './schema';

import Password from '~/utils/password.server';

const DATABASE_URL = process.env.VITE_DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const seedUsers = async (db: PostgresJsDatabase) => {
  const data: User[] = [];
  const password = await Password.hash('123456');

  for (let i = 0; i < 50; i++) {
    const role = i % 2 === 0 ? userRoles.enumValues[0] : userRoles.enumValues[1];

    data.push({
      name: faker.person.fullName(),
      username: `${role === userRoles.enumValues[0] ? 'admin' : 'teacher'}${i + 1}`,
      password,
      role,
    } as User);
  }

  for (let i = 0; i < 10; i++) {
    data.push({
      name: faker.person.fullName(),
      username: `student${i + 1}`,
      password,
      role: userRoles.enumValues[2],
    } as User);
  }

  const result = await db
    .insert(usersTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return result;
};

const seedAssignments = async (db: PostgresJsDatabase, users: User[]) => {
  const data = [];

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      data.push({
        authorId: user.id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
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
  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  const users = await seedUsers(db);
  const assignments = await seedAssignments(db, users);

  console.log('[seedUsers] first 10:', users.slice(0, 10));
  console.log('[seedAssignments] first 10:', assignments.slice(0, 10));

  await client.end();
};

main();
