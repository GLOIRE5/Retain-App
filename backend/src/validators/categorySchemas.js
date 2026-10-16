import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string('Category name is required')
    .trim()
    .min(1, 'Category name is required')
    .max(40, 'Category name is too long'),
});
