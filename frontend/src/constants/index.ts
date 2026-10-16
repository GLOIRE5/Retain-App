import type { PaymentMethod, SortOption } from '../types';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
};

const PAYMENT_METHOD_ORDER: PaymentMethod[] = ['cash', 'card', 'mobile_money', 'bank_transfer'];

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = PAYMENT_METHOD_ORDER.map(
  (value) => ({ value, label: PAYMENT_METHOD_LABELS[value] })
);

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: '-date', label: 'Newest first' },
  { value: 'date', label: 'Oldest first' },
  { value: '-amount', label: 'Highest amount' },
  { value: 'amount', label: 'Lowest amount' },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
