import { z } from 'zod';
import { userRoles } from '~/db/schema';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  role: z.enum(userRoles.enumValues),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserSerialized = UserSchema.pick({
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
});

export const UserLoginSchema = UserSchema.omit({
  id: true,
  name: true,
  role: true,
});

export const UserSignupSchema = UserSchema.omit({
  id: true,
  role: true,
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
  role: true,
});

export const UserSessionSchema = UserSchema.pick({
  id: true,
  username: true,
  role: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserSerialized = z.infer<typeof UserSerialized>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserSignup = z.infer<typeof UserSignupSchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;
