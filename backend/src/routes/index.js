import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import eventRoutes from './eventRoutes.js';
import healthRoutes from './healthRoutes.js';
import volunteerRoutes from './volunteerRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/events', eventRoutes);
router.use('/health', healthRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/ai', aiRoutes);

export default router;
