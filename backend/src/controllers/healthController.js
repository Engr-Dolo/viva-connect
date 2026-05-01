import { asyncHandler } from '../middleware/asyncHandler.js';
import { getHealthStatus } from '../services/healthService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const healthCheck = asyncHandler(async (_req, res) => {
  const status = getHealthStatus();

  return sendSuccess(res, status, 'VIVA Connect service is ready');
});
