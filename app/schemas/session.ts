import { z } from 'zod';

import { UserSchema } from './user';

export const AppUserSessionSchema = UserSchema.pick({
  id: true,
  name: true,
  username: true,
  role: true,
});

export const AppSessionSchema = z.object({
  user: AppUserSessionSchema,
  isAdmin: z.boolean(),
  isTeacher: z.boolean(),
  isStudent: z.boolean(),
});

export type AppSession = z.infer<typeof AppSessionSchema>;
export type AppUserSession = z.infer<typeof AppUserSessionSchema>;
