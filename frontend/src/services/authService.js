import { apiClient } from './apiClient.js';

export const register = async (credentials) => {
  const response = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await apiClient('/auth/me', { token });

  return response.data.user;
};

export const adminResetPassword = async (email) => {
  const response = await apiClient('/auth/admin-reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return response.data;
};
