import type { Database as BetterSQLite3Database } from 'better-sqlite3';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { DATABASE_URL, LOG_LEVEL } from '~/config/env.server';

import { logger } from '~/utils/logger.server';

let client: BetterSQLite3Database;

export const connectToDatabase = () => {
  if (client) {
    return client;
  }

  client = new Database(DATABASE_URL);
  logger.info('[drizzle] Database connected');
  return client;
};

export const db = drizzle(connectToDatabase(), {
  logger: LOG_LEVEL === 'debug',
});
