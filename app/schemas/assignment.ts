import { z } from 'zod';

import { UserSerializedSchema } from './user';

export const AssignmentSchema = z.object({
  id: z.string(),
  authorId: z.string().min(1, { message: 'Author is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AssignmentSerializedSchema = AssignmentSchema.omit({
  authorId: true,
  updatedAt: true,
}).extend({
  author: UserSerializedSchema.pick({
    id: true,
    username: true,
  }),
});

export const AssignmentCreateSchema = AssignmentSchema.pick({
  title: true,
  content: true,
});

export const AssignmentUpdateSchema = AssignmentSchema.pick({
  title: true,
  content: true,
});

export type Assignment = z.infer<typeof AssignmentSchema>;
export type AssignmentSerialized = z.infer<typeof AssignmentSerializedSchema>;
