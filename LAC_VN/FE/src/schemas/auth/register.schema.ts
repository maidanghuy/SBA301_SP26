import * as z from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be 2-100 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^[0-9]{9,11}$/, 'Phone must be 9-11 digits'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
