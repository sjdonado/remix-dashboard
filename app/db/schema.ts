import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userRolesTable = sqliteTable('user_roles', {
  role: text('role').notNull().unique(),
});

export const userRoles = ['admin', 'teacher', 'student'];

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  role: text('role')
    .references(() => userRolesTable.role, { onDelete: 'cascade' })
    .default(userRoles[2]),
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
