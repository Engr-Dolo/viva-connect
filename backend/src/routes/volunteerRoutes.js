import { Router } from 'express';
import {
  createVolunteerHandler,
  deleteVolunteerHandler,
  getVolunteerHandler,
  getVolunteersHandler,
  updateVolunteerHandler,
  getEligibleStaffHandler,
} from '../controllers/volunteerController.js';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';
import { validateQuery, validateRequest } from '../middleware/validateRequest.js';
import { paginationQuerySchema } from '../validators/queryValidator.js';
import { createVolunteerSchema, updateVolunteerSchema } from '../validators/volunteerValidator.js';

const router = Router();

router.use(verifyToken);

router.get('/eligible-staff', getEligibleStaffHandler);

router
  .route('/')
  .get(validateQuery(paginationQuerySchema), getVolunteersHandler)
  .post(authorizeRoles('admin', 'coordinator'), validateRequest(createVolunteerSchema), createVolunteerHandler);

router
  .route('/:id')
  .get(getVolunteerHandler)
  .put(authorizeRoles('admin', 'coordinator'), validateRequest(updateVolunteerSchema), updateVolunteerHandler)
  .delete(authorizeRoles('admin', 'coordinator'), deleteVolunteerHandler);

export default router;
