import api from './client';
import type { BudgetSummary, DashboardData } from '../types';

export const getDashboard = async (month: string): Promise<DashboardData> => {
  const res = await api.get<DashboardData>('/dashboard', { params: { month } });
  return res.data;
};

export const saveBudget = async (month: string, amount: number): Promise<BudgetSummary> => {
  const res = await api.put<{ budget: BudgetSummary }>(`/budgets/${month}`, { amount });
  return res.data.budget;
};
