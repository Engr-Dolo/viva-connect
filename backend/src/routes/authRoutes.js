import { Router } from 'express';
import { getCurrentUser, login, register, adminResetPasswordHandler } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', verifyToken, getCurrentUser);
router.post('/admin-reset-password', verifyToken, adminResetPasswordHandler);

export default router;
