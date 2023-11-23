import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('roles', ['admin', 'teacher', 'student']);
export const usersTable = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  username: varchar('username').unique().notNull(),
  role: userRoles('role').notNull().default(userRoles.enumValues[2]),
  password: varchar('password', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const assignmentsTable = pgTable('assignments', {
  id: text('id').primaryKey().notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => usersTable.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
