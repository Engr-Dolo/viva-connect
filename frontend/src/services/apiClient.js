const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = async (path, options = {}) => {
  const token = options.token || sessionStorage.getItem('viva_connect_token');
  const { token: _token, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...fetchOptions,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    data: null,
    message: 'We could not read the response. Please try again.',
  }));

  if (!response.ok) {
    throw new Error(payload.message || 'Unable to complete the request. Please try again.');
  }

  return payload;
};
