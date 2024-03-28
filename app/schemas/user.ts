import { z } from 'zod';

import { ALL_USER_ROLES } from '~/constants/user';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  role: z.enum(ALL_USER_ROLES),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserSerializedSchema = UserSchema.pick({
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
});

export const UserLoginSchema = UserSchema.pick({
  username: true,
  password: true,
});

export const UserSignupSchema = UserSchema.pick({
  name: true,
  username: true,
  password: true,
})
  .extend({
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['confirmPassword'],
      });
    }
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

export const UserMeUpdateSchema = UserSchema.pick({
  name: true,
  username: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserSerialized = z.infer<typeof UserSerializedSchema>;
