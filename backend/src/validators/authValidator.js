import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('A valid email is required').max(120).toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['admin', 'coordinator', 'volunteer']).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('A valid email is required').max(120).toLowerCase(),
  password: z.string().min(1, 'Password is required').max(128),
});
