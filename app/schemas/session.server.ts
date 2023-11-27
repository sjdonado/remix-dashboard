import { z } from 'zod';

import { UserSchema } from './user';

export const AppSessionSchema = z.object({
  user: UserSchema.pick({
    id: true,
    username: true,
    role: true,
  }),
  isAdmin: z.boolean(),
  isTeacher: z.boolean(),
  isStudent: z.boolean(),
});

export type AppSession = z.infer<typeof AppSessionSchema>;
