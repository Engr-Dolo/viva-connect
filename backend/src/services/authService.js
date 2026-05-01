import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn },
  );
};

export const registerUser = async ({ name, email, password, role }) => {
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
  });

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
};

export const adminResetUserPassword = async (adminRole, targetEmail) => {
  if (!['admin', 'coordinator'].includes(adminRole)) {
    throw new AppError('Not authorized to reset passwords', 403);
  }

  const user = await User.findOne({ email: targetEmail });
  if (!user) {
    throw new AppError('User not found with this email', 404);
  }

  // Generate a temporary 8-character password
  const tempPassword = Math.random().toString(36).slice(-8);
  
  const hashedPassword = await bcrypt.hash(tempPassword, 12);
  user.password = hashedPassword;
  await user.save();

  return { tempPassword, user: sanitizeUser(user) };
};
