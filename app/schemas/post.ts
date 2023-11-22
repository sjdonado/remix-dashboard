import { z } from 'zod';
import { UserSerialized } from './user';

export const PostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PostSerialized = PostSchema.omit({
  authorId: true,
  updatedAt: true,
}).extend({
  author: UserSerialized.pick({
    id: true,
    name: true,
    username: true,
  }),
});

export type Post = z.infer<typeof PostSchema>;
export type PostSerialized = z.infer<typeof PostSerialized>;
