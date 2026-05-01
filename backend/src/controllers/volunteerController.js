import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createVolunteer,
  deleteVolunteer,
  getVolunteerById,
  getVolunteers,
  updateVolunteer,
} from '../services/volunteerService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createVolunteerHandler = asyncHandler(async (req, res) => {
  const volunteer = await createVolunteer(req.body);

  return sendSuccess(res, { volunteer }, 'Volunteer created successfully', 201);
});

export const getVolunteersHandler = asyncHandler(async (req, res) => {
  const result = await getVolunteers(req.query);

  return sendSuccess(res, result, 'Volunteers retrieved successfully');
});

export const getVolunteerHandler = asyncHandler(async (req, res) => {
  const volunteer = await getVolunteerById(req.params.id);

  return sendSuccess(res, { volunteer }, 'Volunteer retrieved successfully');
});

export const updateVolunteerHandler = asyncHandler(async (req, res) => {
  const volunteer = await updateVolunteer(req.params.id, req.body);

  return sendSuccess(res, { volunteer }, 'Volunteer updated successfully');
});

export const deleteVolunteerHandler = asyncHandler(async (req, res) => {
  const volunteer = await deleteVolunteer(req.params.id);

  return sendSuccess(res, { volunteer }, 'Volunteer deleted successfully');
});
