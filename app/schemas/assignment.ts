import { z } from 'zod';

import { UserSchema } from './user';
import { ALL_ASSIGNMENT_STATUSES, ALL_ASSIGNMENT_TYPES } from '~/constants/assignment';
import { formatDateToLocal } from '~/utils/date';

export const AssignmentSchema = z.object({
  id: z.string(),
  authorId: z.string().min(1, { message: 'Author is required' }),
  type: z.enum(ALL_ASSIGNMENT_TYPES, { required_error: 'Type is required' }),
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
})
  .extend({
    author: UserSchema.pick({
      id: true,
    }).extend({
      username: z.string().nullable(),
    }),
  })
  .transform(data => ({
    ...data,
    dueAt: formatDateToLocal(data.dueAt),
    createdAt: formatDateToLocal(data.createdAt),
    updatedAt: formatDateToLocal(data.updatedAt),
  }));

export const AssignmentSerializedCardSchema = AssignmentSchema.omit({
  authorId: true,
  duateAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  author: UserSchema.pick({
    id: true,
  }).extend({
    username: z.string().nullable(),
  }),
  dueAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type AssignmentCreate = z.infer<typeof AssignmentCreateSchema>;
export type AssignmentUpdate = z.infer<typeof AssignmentUpdateSchema>;
export type AssignmentUpdateStatus = z.infer<typeof AssignmentUpdateStatusSchema>;
export type AssignmentSerialized = z.infer<typeof AssignmentSerializedSchema>;
export type AssignmentSerializedCard = z.infer<typeof AssignmentSerializedCardSchema>;
