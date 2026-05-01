import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    return next(new AppError(message, 400));
  }

  req.body = result.data;
  return next();
};

export const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    return next(new AppError(message, 400));
  }

  req.query = result.data;
  return next();
};
