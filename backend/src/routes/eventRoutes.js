import { Router } from 'express';
import {
  createEventHandler,
  deleteEventHandler,
  getEventHandler,
  getEventsHandler,
  updateEventHandler,
} from '../controllers/eventController.js';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';
import { validateQuery, validateRequest } from '../middleware/validateRequest.js';
import { createEventSchema, updateEventSchema } from '../validators/eventValidator.js';
import { paginationQuerySchema } from '../validators/queryValidator.js';

const router = Router();

router.use(verifyToken);

router
  .route('/')
  .get(validateQuery(paginationQuerySchema), getEventsHandler)
  .post(authorizeRoles('admin', 'coordinator'), validateRequest(createEventSchema), createEventHandler);

router
  .route('/:id')
  .get(getEventHandler)
  .put(authorizeRoles('admin', 'coordinator'), validateRequest(updateEventSchema), updateEventHandler)
  .delete(authorizeRoles('admin', 'coordinator'), deleteEventHandler);

export default router;
