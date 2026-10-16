import { z } from 'zod';

export const budgetSchema = z.object({
  amount: z.coerce
    .number('Budget amount must be a number')
    .positive('Budget must be greater than 0')
    .max(1_000_000_000_000, 'Budget is too large'),
});
