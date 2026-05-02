import { Router } from 'express';
import { getAllUsers, updateUserStatus, createUser, clearStatusFlag, updateUserRole } from '../controllers/userController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// All routes here are protected
router.use(verifyToken);

router.post('/clear-status-flag', clearStatusFlag);

// Admin-only routes
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.patch('/:id/status', updateUserStatus);
router.patch('/:id/role', updateUserRole);

export default router;
