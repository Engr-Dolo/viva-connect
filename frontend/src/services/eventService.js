import { apiClient } from './apiClient.js';

export const getEvents = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });
  const response = await apiClient(`/events?${params.toString()}`);

  return response.data;
};

export const createEvent = async (payload) => {
  const response = await apiClient('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data.event;
};

export const updateEvent = async (id, payload) => {
  const response = await apiClient(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return response.data.event;
};

export const deleteEvent = async (id) => {
  const response = await apiClient(`/events/${id}`, {
    method: 'DELETE',
  });

  return response.data.event;
};
