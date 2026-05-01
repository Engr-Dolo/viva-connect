import { asyncHandler } from '../middleware/asyncHandler.js';
import { getDashboardStats } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardStatsHandler = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();

  return sendSuccess(res, stats, 'Impact summary retrieved successfully');
});
