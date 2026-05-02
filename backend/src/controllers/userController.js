import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import bcrypt from 'bcrypt';

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  statusUpdateFlag: user.statusUpdateFlag,
  statusMessage: user.statusMessage,
  createdAt: user.createdAt,
});

/**
 * Get all users with pagination and filters
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const role = req.query.role || '';

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) {
    query.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return sendSuccess(res, {
    users: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * Create a new user (Admin Only)
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'volunteer',
    status: 'active',
  });

  return sendSuccess(res, { user: sanitizeUser(user) }, 'User created successfully', 201);
});

/**
 * Update user status (Suspend/Reinstate)
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'suspended'].includes(status)) {
    throw new AppError('Invalid status value', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent admin from suspending themselves
  if (user._id.toString() === req.user.id) {
    throw new AppError('You cannot suspend your own account', 400);
  }

  user.status = status;
  user.statusUpdateFlag = true;
  user.statusMessage = status === 'suspended' 
    ? 'Your account access has been restricted by an administrator.' 
    : 'Your account access has been restored. Welcome back to the platform!';
    
  await user.save();

  return sendSuccess(res, { user: sanitizeUser(user) }, `Account ${status === 'suspended' ? 'suspended' : 'reinstated'} successfully`);
});

/**
 * Update user role (Admin Only)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'coordinator', 'volunteer'].includes(role)) {
    throw new AppError('Invalid role value', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent admin from changing their own role to something else
  if (user._id.toString() === req.user.id && role !== 'admin') {
    throw new AppError('You cannot demote yourself from the Admin role', 400);
  }

  const oldRole = user.role;
  user.role = role;
  user.statusUpdateFlag = true;
  user.statusMessage = `Your institutional role has been updated from ${oldRole.toUpperCase()} to ${role.toUpperCase()}.`;
  
  await user.save();

  return sendSuccess(res, { user: sanitizeUser(user) }, `User role updated to ${role} successfully`);
});
/**
 * Clear status update flag for current user
 */
export const clearStatusFlag = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.statusUpdateFlag = false;
  await user.save();

  return sendSuccess(res, null, 'Status flag cleared');
});
