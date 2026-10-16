import axios from 'axios';

export const TOKEN_KEY = 'retain_token';
export const UNAUTHORIZED_EVENT = 'retain:unauthorized';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server rejects our token, clear it and tell the auth layer to sign the user out
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthAttempt = url.startsWith('/auth/login') || url.startsWith('/auth/signup');
      if (!isAuthAttempt) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response) {
      return error.response.data?.message ?? 'Request failed';
    }
    return 'Cannot reach the server. Check your connection and try again.';
  }
  return error instanceof Error ? error.message : 'Something went wrong';
};

export default api;
