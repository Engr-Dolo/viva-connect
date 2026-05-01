import { asyncHandler } from '../middleware/asyncHandler.js';
import { getUserById, loginUser, registerUser, adminResetUserPassword } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  return sendSuccess(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return sendSuccess(res, result, 'Login successful');
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  return sendSuccess(res, { user }, 'Authenticated user retrieved');
});

export const adminResetPasswordHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const result = await adminResetUserPassword(req.user.role, email);

  return sendSuccess(res, result, 'Temporary password generated');
});
