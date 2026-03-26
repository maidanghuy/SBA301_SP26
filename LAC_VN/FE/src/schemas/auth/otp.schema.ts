import * as z from 'zod';

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().min(4, 'OTP must be at least 4 characters'),
});

export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
