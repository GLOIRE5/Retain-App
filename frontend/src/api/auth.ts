import api from './client';
import type { AuthResponse, User } from '../types';

export const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
};

export const signupRequest = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/signup', { name, email, password });
  return res.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await api.get<{ user: User }>('/auth/me');
  return res.data.user;
};
