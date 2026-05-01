import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from '../services/eventService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createEventHandler = asyncHandler(async (req, res) => {
  const event = await createEvent(req.body, req.user.id);

  return sendSuccess(res, { event }, 'Event created successfully', 201);
});

export const getEventsHandler = asyncHandler(async (req, res) => {
  const result = await getEvents(req.query);

  return sendSuccess(res, result, 'Events retrieved successfully');
});

export const getEventHandler = asyncHandler(async (req, res) => {
  const event = await getEventById(req.params.id);

  return sendSuccess(res, { event }, 'Event retrieved successfully');
});

export const updateEventHandler = asyncHandler(async (req, res) => {
  const event = await updateEvent(req.params.id, req.body);

  return sendSuccess(res, { event }, 'Event updated successfully');
});

export const deleteEventHandler = asyncHandler(async (req, res) => {
  const event = await deleteEvent(req.params.id);

  return sendSuccess(res, { event }, 'Event deleted successfully');
});
