import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { DATABASE_PATH } from '~/config/env.server';

const sqlite = new Database(DATABASE_PATH);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite);

migrate(db, { migrationsFolder: './app/db/migrations' });
