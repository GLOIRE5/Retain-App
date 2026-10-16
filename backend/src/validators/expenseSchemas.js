import { z } from 'zod';
import { PAYMENT_METHODS } from '../models/Expense.js';

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid id');

export const expenseSchema = z.object({
  title: z.string('Title is required').trim().min(1, 'Title is required').max(100, 'Title is too long'),
  amount: z.coerce.number('Amount must be a number').positive('Amount must be greater than 0'),
  category: objectId,
  date: z.coerce.date('Date is invalid'),
  paymentMethod: z.enum(PAYMENT_METHODS, 'Invalid payment method'),
  notes: z.string().trim().max(500, 'Notes are too long').optional().default(''),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).optional(),
  category: objectId.optional(),
  paymentMethod: z.enum(PAYMENT_METHODS, 'Invalid payment method').optional(),
  from: z.coerce.date('from must be a valid date').optional(),
  to: z.coerce.date('to must be a valid date').optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  sort: z.enum(['date', '-date', 'amount', '-amount']).default('-date'),
});
