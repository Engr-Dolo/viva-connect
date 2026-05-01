import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const getBearerToken = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ');
  return scheme === 'Bearer' ? token : null;
};

export const verifyToken = async (req, _res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      throw new AppError('Authentication token is required', 401);
    }

    const payload = jwt.verify(token, env.jwt.secret);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new AppError('Authenticated user no longer exists', 401);
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError('Invalid or expired authentication token', 401));
  }
};

export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to access this resource', 403));
  }

  return next();
};
