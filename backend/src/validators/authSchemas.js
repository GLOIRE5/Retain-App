import { z } from 'zod';

const email = z.string().trim().toLowerCase().pipe(z.email('Email is invalid'));

export const signupSchema = z.object({
  name: z.string('Name is required').trim().min(1, 'Name is required').max(60, 'Name is too long'),
  email,
  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long'),
});

export const loginSchema = z.object({
  email,
  password: z.string('Password is required').min(1, 'Password is required'),
});
