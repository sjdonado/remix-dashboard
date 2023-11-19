import { pgEnum, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('roles', ['admin', 'teacher', 'student']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: varchar('username').notNull(),
  role: userRoles('role').notNull().default(userRoles.enumValues[2]),
  password: varchar('password', { length: 256 }).notNull(),
});
