import 'dotenv/config';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { faker } from '@faker-js/faker';

import type { User } from '~/schemas/user';
import { userRoles, users } from './schema';
import Password from '~/utils/password';

const DATABASE_URL = process.env.VITE_DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const seedUsers = async (db: PostgresJsDatabase) => {
  const data: User[] = [];
  const password = await Password.hash('123456');

  for (let i = 0; i < 20; i++) {
    const role = i % 2 === 0 ? userRoles.enumValues[0] : userRoles.enumValues[1];

    data.push({
      name: faker.person.fullName(),
      username: `${role === userRoles.enumValues[0] ? 'admin' : 'teacher'}${i + 1}`,
      password,
      role,
    });
  }

  const result = await db.insert(users).values(data).onConflictDoNothing().returning();
  console.log(result);
};

const main = async () => {
  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  await Promise.all([seedUsers(db)]);

  await client.end();
};

main();
