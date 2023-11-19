import 'dotenv/config';

import type { Config } from 'drizzle-kit';

const DATABASE_URL = process.env.VITE_DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default {
  schema: './app/db/schema.ts',
  out: './app/db/migrations',
  driver: 'pg',
  dbCredentials: { connectionString: DATABASE_URL },
  strict: true,
} satisfies Config;
