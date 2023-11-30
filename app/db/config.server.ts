import { count } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { DATABASE_URL } from '~/config/env.server';

import { usersTable } from './schema';
import { seedAssignments, seedUsers } from './seed.server';

const sqlite = new Database(DATABASE_URL);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite);
migrate(db, { migrationsFolder: 'app/db/migrations' });

console.log('[drizzle] Database connected');

if ((await db.select({ count: count() }).from(usersTable))[0].count === 0) {
  const users = await seedUsers(db);
  console.log('[drizzle] Seeded', 'users', users.length);

  const assignments = await seedAssignments(db, users);
  console.log('[drizzle] Seeded', 'assignments', assignments.length);
}
