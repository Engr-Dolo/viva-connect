import express from 'express';
import { getEventReport, getVolunteerRecommendations, getDashboardInsights } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/dashboard/insights', getDashboardInsights);
router.get('/events/:id/report', getEventReport);
router.post('/events/recommend-volunteers', getVolunteerRecommendations);

export default router;
