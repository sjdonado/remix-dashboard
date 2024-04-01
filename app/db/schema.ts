import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AssignmentStatus, AssignmentType } from '~/constants/assignment';
import { UserRole } from '~/constants/user';

export const usersTable = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID())
    .notNull(),
  username: text('username').unique().notNull(),
  role: text('role')
    .$type<UserRole.Admin | UserRole.Teacher | UserRole.Student>()
    .default(UserRole.Student)
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const assignmentsTable = sqliteTable('assignments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID())
    .notNull(),
  authorId: text('author_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  status: text('status')
    .$type<AssignmentStatus.Open | AssignmentStatus.Closed>()
    .default(AssignmentStatus.Open)
    .notNull(),
  type: text('type')
    .$type<AssignmentType.Homework | AssignmentType.Quiz | AssignmentType.Project>()
    .default(AssignmentType.Homework)
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  points: integer('points').notNull(),
  dueAt: integer('due_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
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
