import { env } from '../config/env.js';

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const isOperationalError = statusCode < 500;
  const message = isOperationalError || env.nodeEnv === 'development'
    ? error.message
    : 'Internal server error';

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  });
};
