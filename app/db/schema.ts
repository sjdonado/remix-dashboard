import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('roles', ['admin', 'teacher', 'student']);
export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  username: varchar('username').unique().notNull(),
  role: userRoles('role').notNull().default(userRoles.enumValues[2]),
  password: varchar('password', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const assignmentsTable = pgTable('assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
