import { z } from 'zod';

import { ALL_USER_ROLES } from '~/constants/user';
import { formatDateToLocal } from '~/utils/date';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(1, { message: 'Username is required' }),
  role: z.enum(ALL_USER_ROLES),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserLoginSchema = UserSchema.pick({
  username: true,
  role: true,
}).extend({
  redirectTo: z.string().nullish(),
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserUpdateSchema = UserSchema.pick({
  username: true,
}).extend({
  role: z.enum(ALL_USER_ROLES).optional(),
});

export const UserSessionSchema = UserSchema.pick({
  id: true,
  username: true,
  role: true,
}).extend({
  isAdmin: z.boolean(),
  isTeacher: z.boolean(),
  isStudent: z.boolean(),
});

export const UserSerializedSchema = UserSchema.pick({
  id: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}).transform(data => ({
  ...data,
  createdAt: formatDateToLocal(data.createdAt),
  updatedAt: formatDateToLocal(data.updatedAt),
}));

export type User = z.infer<typeof UserSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;
export type UserSerialized = z.infer<typeof UserSerializedSchema>;
