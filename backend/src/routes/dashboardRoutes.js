import { Router } from 'express';
import { getDashboardStatsHandler } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', verifyToken, getDashboardStatsHandler);

export default router;
