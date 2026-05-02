import { apiClient } from './apiClient.js';

export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const payload = await apiClient(`/users?${query}`);
  return payload.data;
};

export const createUser = async (userData) => {
  const payload = await apiClient('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return payload.data;
};

export const updateUserStatus = async (userId, status) => {
  const payload = await apiClient(`/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return payload.data;
};

export const clearStatusFlag = async () => {
  const payload = await apiClient('/users/clear-status-flag', {
    method: 'POST',
  });
  return payload.data;
};

export const updateUserRole = async (userId, role) => {
  const payload = await apiClient(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  return payload.data;
};
