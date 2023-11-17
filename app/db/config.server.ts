import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import postgres from 'postgres';

import { DATABASE_URL } from '~/config/env';

const migrationClient = postgres(DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "./app/db/migrations" });

const client = postgres(DATABASE_URL);
export const db = drizzle(client);
