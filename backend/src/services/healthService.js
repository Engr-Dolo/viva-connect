export const getHealthStatus = () => ({
  service: 'viva-connect-api',
  status: 'ok',
  timestamp: new Date().toISOString(),
});
