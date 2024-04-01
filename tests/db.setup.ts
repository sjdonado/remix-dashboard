import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { test as setup } from '@playwright/test';

import { seedAssignments, seedUsers } from '~/db/seed.server';
import { DATABASE_URL } from '~/config/env.server';
import { assignmentsTable, usersTable } from '~/db/schema';

setup('cleanup and seed database', async () => {
  const client = new Database(DATABASE_URL);
  const db = drizzle(client);

  migrate(db, {
    migrationsFolder: './app/db/migrations',
  });

  await Promise.all([db.delete(usersTable).run(), db.delete(assignmentsTable).run()]);

  await seedUsers(db);
  await seedAssignments(db);
});
