import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { UserRole } from '~/constants/user';

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  role: text('role')
    .notNull()
    .$type<UserRole.Admin | UserRole.Teacher | UserRole.Student>()
    .default(UserRole.Student),
  password: text('password', { length: 256 }).notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const assignmentsTable = sqliteTable('assignments', {
  id: text('id').primaryKey(),
  authorId: text('author_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
