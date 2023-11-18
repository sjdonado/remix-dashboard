import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: varchar('username').notNull(),
  password: varchar('password', { length: 256 }).notNull(),
});
