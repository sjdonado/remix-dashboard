import { v4 as uuidv4 } from 'uuid';

import 'dotenv/config';

import { faker } from '@faker-js/faker';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import type { User } from '~/schemas/user';
import { assignmentsTable, userRoles, userRolesTable, usersTable } from './schema';

import Password from '~/utils/password.server';

const DATABASE_PATH = process.env.DATABASE_PATH;
if (!DATABASE_PATH) throw new Error('DATABASE_PATH is not set');

const seedUsers = async (db: BetterSQLite3Database) => {
  const data: User[] = [];
  const password = await Password.hash('123456');

  console.log(
    userRoles.map(role => ({
      role,
    }))
  );

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

const seedAssignments = async (db: BetterSQLite3Database, users: User[]) => {
  const data = [];

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      data.push({
        id: uuidv4(),
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

const sqlite = new Database(DATABASE_PATH);
sqlite.pragma('journal_mode = WAL');

const db = drizzle(sqlite);

const users = await seedUsers(db);
const assignments = await seedAssignments(db, users);

console.log('[seedUsers] first 10:', users.slice(0, 10));
console.log('[seedAssignments] first 10:', assignments.slice(0, 10));
