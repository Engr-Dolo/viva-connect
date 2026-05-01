import { apiClient } from './apiClient.js';

export const getDashboardInsights = async () => {
  const payload = await apiClient('/ai/dashboard/insights');
  return payload.data.insights;
};

export const getEventReport = async (eventId) => {
  const payload = await apiClient(`/ai/events/${eventId}/report`);
  return payload.data.report;
};

export const getVolunteerRecommendations = async (eventData) => {
  const payload = await apiClient('/ai/events/recommend-volunteers', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
  return payload.data.recommendations;
};
