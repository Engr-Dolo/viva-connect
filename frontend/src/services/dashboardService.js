import { apiClient } from './apiClient.js';

export const getDashboardStats = async () => {
  const response = await apiClient('/dashboard/stats');

  return response.data;
};
