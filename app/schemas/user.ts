import { z } from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

export const UserLoginSchema = UserSchema.omit({
  name: true,
});

export const UserSignupSchema = UserSchema.extend({
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm Password is required" })
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
