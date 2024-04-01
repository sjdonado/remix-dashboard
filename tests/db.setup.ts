import { exec } from 'child_process';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { test as setup } from '@playwright/test';

import { seedAssignments, seedUsers } from '~/db/seed.server';
import { DATABASE_URL } from '~/config/env.server';

setup('cleanup and seed database', async () => {
  await new Promise((resolve, reject) => {
    exec('rm -rf db.test.sqlite*', (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Error executing command: ${error.message}`));
      }

      if (stderr) {
        return reject(new Error(stderr));
      }

      resolve(stdout);
    });
  });

  const client = new Database(DATABASE_URL);

  const db = drizzle(client);

  migrate(db, {
    migrationsFolder: './app/db/migrations',
  });

  await seedUsers(db);
  await seedAssignments(db);
});
