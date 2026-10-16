import api from './client';
import type {
  Expense,
  ExpenseInput,
  ExpenseListResponse,
  PaymentMethod,
  SortOption,
} from '../types';

export interface ExpenseListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  paymentMethod?: PaymentMethod;
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  sort?: SortOption;
}

export const listExpenses = async (params: ExpenseListParams): Promise<ExpenseListResponse> => {
  const res = await api.get<ExpenseListResponse>('/expenses', { params });
  return res.data;
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  const res = await api.get<{ expense: Expense }>(`/expenses/${id}`);
  return res.data.expense;
};

export const createExpense = async (input: ExpenseInput): Promise<Expense> => {
  const res = await api.post<{ expense: Expense }>('/expenses', input);
  return res.data.expense;
};

export const updateExpense = async (id: string, input: ExpenseInput): Promise<Expense> => {
  const res = await api.put<{ expense: Expense }>(`/expenses/${id}`, input);
  return res.data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};
