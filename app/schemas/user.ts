import { z } from 'zod';

import { ALL_USER_ROLES } from '~/constants/user';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  role: z.enum(ALL_USER_ROLES),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserLoginSchema = UserSchema.pick({
  username: true,
  password: true,
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserUpdateSchema = UserSchema.pick({
  name: true,
  username: true,
}).extend({
  role: z.enum(ALL_USER_ROLES).optional(),
});

export const UserSessionSchema = UserSchema.pick({
  id: true,
  username: true,
  role: true,
});

export const UserSerializedSchema = UserSchema.pick({
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;
export type UserSerialized = z.infer<typeof UserSerializedSchema>;
