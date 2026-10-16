import type { PaymentMethod, SortOption } from '../types';

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: '-date', label: 'Newest first' },
  { value: 'date', label: 'Oldest first' },
  { value: '-amount', label: 'Highest amount' },
  { value: 'amount', label: 'Lowest amount' },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
