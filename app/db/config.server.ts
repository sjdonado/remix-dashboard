import pg from 'pg';

import { drizzle } from 'drizzle-orm/node-postgres';

import { DATABASE_URL } from '~/config/env.server';

const pool = new pg.Pool({ connectionString: DATABASE_URL });
await pool.connect();

export const db = drizzle(pool);
