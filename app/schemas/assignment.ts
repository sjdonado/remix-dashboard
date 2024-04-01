import { z } from 'zod';

import { UserSerializedSchema } from './user';
import { ALL_ASSIGNMENT_STATUSES, ALL_ASSIGNMENT_TYPES } from '~/constants/assignment';

export const AssignmentSchema = z.object({
  id: z.string(),
  authorId: z.string().min(1, { message: 'Author is required' }),
  type: z.enum(ALL_ASSIGNMENT_TYPES),
  status: z.enum(ALL_ASSIGNMENT_STATUSES),
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  points: z.number().min(1, { message: 'Points is required' }),
  dueAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AssignmentCreateSchema = AssignmentSchema.pick({
  type: true,
});

export const AssignmentUpdateSchema = AssignmentSchema.pick({
  type: true,
});

export const AssignmentUpdateStatusSchema = AssignmentSchema.pick({
  status: true,
});

export const AssignmentSerializedSchema = AssignmentSchema.omit({
  authorId: true,
}).extend({
  author: UserSerializedSchema.pick({
    id: true,
  }).extend({
    username: z.string().nullable(),
  }),
});

export const AssignmentSerializedCardSchema = AssignmentSerializedSchema.omit({
  authorId: true,
  duateAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  dueAt: z.string(),
  createdAt: z.string(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type AssignmentCreate = z.infer<typeof AssignmentCreateSchema>;
export type AssignmentUpdate = z.infer<typeof AssignmentUpdateSchema>;
export type AssignmentUpdateStatus = z.infer<typeof AssignmentUpdateStatusSchema>;
export type AssignmentSerialized = z.infer<typeof AssignmentSerializedSchema>;
export type AssignmentSerializedCard = z.infer<typeof AssignmentSerializedCardSchema>;
