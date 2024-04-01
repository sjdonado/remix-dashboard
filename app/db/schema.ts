import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AssignmentStatus, AssignmentType } from '~/constants/assignment';
import { UserRole } from '~/constants/user';

export const usersTable = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  username: text('username').unique().notNull(),
  role: text('role')
    .notNull()
    .$type<UserRole.Admin | UserRole.Teacher | UserRole.Student>()
    .default(UserRole.Student),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const assignmentsTable = sqliteTable('assignments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  authorId: text('author_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  status: text('status')
    .notNull()
    .$type<AssignmentStatus.Open | AssignmentStatus.Closed>()
    .default(AssignmentStatus.Open),
  type: text('type')
    .notNull()
    .$type<AssignmentType.Homework | AssignmentType.Quiz | AssignmentType.Project>()
    .default(AssignmentType.Homework),
  title: text('title').notNull(),
  content: text('content').notNull(),
  points: integer('points').notNull(),
  dueAt: integer('due_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// not supported yet by drizzle https://orm.drizzle.team/docs/views
// export const assignmentView = sqliteView('assignmentView').as(qb =>
//   qb
//     .select({
//       id: assignmentsTable.id,
//       status: assignmentsTable.status,
//       type: assignmentsTable.type,
//       title: assignmentsTable.title,
//       content: assignmentsTable.content,
//       points: assignmentsTable.points,
//       dueAt: assignmentsTable.dueAt,
//       createdAt: assignmentsTable.createdAt,
//       updatedAt: assignmentsTable.updatedAt,
//       author: {
//         id: assignmentsTable.authorId,
//         username: usersTable.username,
//       },
//     })
//     .from(assignmentsTable)
//     .leftJoin(usersTable, eq(assignmentsTable.authorId, usersTable.id))
// );
