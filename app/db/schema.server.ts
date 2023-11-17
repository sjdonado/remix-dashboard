import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email').notNull(),
  password: varchar('password', { length: 256 }).notNull(),
});
