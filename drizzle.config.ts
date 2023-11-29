import 'dotenv/config';

import type { Config } from 'drizzle-kit';

const DATABASE_PATH = process.env.DATABASE_PATH;
if (!DATABASE_PATH) throw new Error('DATABASE_PATH is not set');

export default {
  schema: './app/db/schema.ts',
  out: './app/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: DATABASE_PATH,
  },
  strict: true,
} satisfies Config;
