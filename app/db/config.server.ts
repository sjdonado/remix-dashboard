import { count } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { DATABASE_URL } from '~/config/env.server';

import { usersTable } from './schema';
import { seedAssignments, seedUsers } from './seed.server';

import { logger } from '~/utils/logger.server';

const sqlite = new Database(DATABASE_URL);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite);
migrate(db, { migrationsFolder: 'app/db/migrations' });

logger.info('[drizzle] Database connected');

if ((await db.select({ count: count() }).from(usersTable))[0].count === 0) {
  const users = await seedUsers(db);
  logger.info(`[drizzle] Seeded ${users.length} users`);

  const assignments = await seedAssignments(db, users);
  logger.info(`[drizzle] Seeded ${assignments.length} assignments`);
}
