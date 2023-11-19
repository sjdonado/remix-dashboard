import { z } from 'zod';
import { userRoles } from '~/db/schema';

export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  role: z.enum(userRoles.enumValues),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const UserLoginSchema = UserSchema.omit({
  name: true,
  role: true,
});

export const UserSignupSchema = UserSchema.omit({
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

export const UserSessionSchema = UserSchema.pick({
  username: true,
  role: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserSignup = z.infer<typeof UserSignupSchema>;
export type UserSession = z.infer<typeof UserSessionSchema>;
