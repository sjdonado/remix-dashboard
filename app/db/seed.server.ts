import 'dotenv/config';

import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

import postgres from 'postgres';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';

import type { User } from '~/schemas/user';
import { userRoles, usersTable } from './schema';

import Password from '~/utils/password';

const DATABASE_URL = process.env.VITE_DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const seedUsers = async (db: PostgresJsDatabase) => {
  const data: User[] = [];
  const password = await Password.hash('123456');

  for (let i = 0; i < 50; i++) {
    const role = i % 2 === 0 ? userRoles.enumValues[0] : userRoles.enumValues[1];

    data.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: `${role === userRoles.enumValues[0] ? 'admin' : 'teacher'}${i + 1}`,
      password,
      role,
    } as User);
  }

  const result = await db
    .insert(usersTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  console.log('[seedUsers]', result);
};

const main = async () => {
  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  await Promise.all([seedUsers(db)]);

  await client.end();
};

main();
