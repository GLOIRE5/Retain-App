import api from './client';
import type { AdminCategory, AdminInsights, Category } from '../types';

export interface DeleteCategoryResult {
  message: string;
  reassignedExpenses: number;
  reassignedTo: string;
}

export const getAdminInsights = async (): Promise<AdminInsights> => {
  const res = await api.get<AdminInsights>('/admin/insights');
  return res.data;
};

export const listAdminCategories = async (): Promise<AdminCategory[]> => {
  const res = await api.get<{ categories: AdminCategory[] }>('/admin/categories');
  return res.data.categories;
};

export const createAdminCategory = async (name: string): Promise<Category> => {
  const res = await api.post<{ category: Category }>('/admin/categories', { name });
  return res.data.category;
};

export const updateAdminCategory = async (id: string, name: string): Promise<Category> => {
  const res = await api.put<{ category: Category }>(`/admin/categories/${id}`, { name });
  return res.data.category;
};

export const deleteAdminCategory = async (id: string): Promise<DeleteCategoryResult> => {
  const res = await api.delete<DeleteCategoryResult>(`/admin/categories/${id}`);
  return res.data;
};
