import { z } from 'zod';

import { UserSerialized } from './user';

export const AssignmentSchema = z.object({
  id: z.string(),
  authorId: z.string().min(1, { message: 'Author is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AssignmentSerialized = AssignmentSchema.omit({
  authorId: true,
  updatedAt: true,
}).extend({
  author: UserSerialized.pick({
    id: true,
    name: true,
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
export type AssignmentSerialized = z.infer<typeof AssignmentSerialized>;
