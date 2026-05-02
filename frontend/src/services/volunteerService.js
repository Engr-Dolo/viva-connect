import { apiClient } from './apiClient.js';

export const getVolunteers = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const response = await apiClient(`/volunteers?${params.toString()}`);

  return response.data;
};

export const getEligibleStaff = async () => {
  const response = await apiClient('/volunteers/eligible-staff');
  return response.data.staff;
};

export const createVolunteer = async (payload) => {
  const response = await apiClient('/volunteers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data.volunteer;
};

export const updateVolunteer = async (id, payload) => {
  const response = await apiClient(`/volunteers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return response.data.volunteer;
};

export const deleteVolunteer = async (id) => {
  const response = await apiClient(`/volunteers/${id}`, {
    method: 'DELETE',
  });

  return response.data.volunteer;
};
