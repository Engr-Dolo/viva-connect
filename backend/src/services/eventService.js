import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { Volunteer } from '../models/Volunteer.js';
import { AppError } from '../utils/AppError.js';
import { logEventCreated } from './googleSheetsService.js';

const ensureValidObjectId = (id, label = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

const uniqueIds = (ids = []) => [...new Set(ids.map((id) => id.toString()))];

const sanitizeVolunteerSummary = (volunteer) => ({
  id: volunteer._id.toString(),
  name: volunteer.name,
  email: volunteer.email,
});

const sanitizeEvent = (event) => ({
  id: event._id.toString(),
  title: event.title,
  description: event.description,
  date: event.date,
  location: event.location,
  peopleServed: event.peopleServed,
  volunteers: (event.volunteers || []).map((volunteer) => {
    if (volunteer && typeof volunteer === 'object' && volunteer.name) {
      return sanitizeVolunteerSummary(volunteer);
    }

    return volunteer.toString();
  }),
  createdBy: event.createdBy,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
});

const validateVolunteerIds = async (volunteerIds = []) => {
  const ids = uniqueIds(volunteerIds);

  ids.forEach((id) => ensureValidObjectId(id, 'volunteer id'));

  if (ids.length === 0) {
    return [];
  }

  const count = await Volunteer.countDocuments({ _id: { $in: ids } });

  if (count !== ids.length) {
    throw new AppError('One or more assigned volunteers were not found', 400);
  }

  return ids;
};

const syncVolunteerAssignments = async (eventId, previousIds = [], nextIds = []) => {
  const previous = uniqueIds(previousIds);
  const next = uniqueIds(nextIds);
  const toRemove = previous.filter((id) => !next.includes(id));
  const toAdd = next.filter((id) => !previous.includes(id));

  await Promise.all([
    toRemove.length
      ? Volunteer.updateMany({ _id: { $in: toRemove } }, { $pull: { assignedEvents: eventId } })
      : Promise.resolve(),
    toAdd.length
      ? Volunteer.updateMany({ _id: { $in: toAdd } }, { $addToSet: { assignedEvents: eventId } })
      : Promise.resolve(),
  ]);
};

export const createEvent = async (payload, userId) => {
  const volunteerIds = await validateVolunteerIds(payload.volunteers);
  const event = await Event.create({
    ...payload,
    volunteers: volunteerIds,
    createdBy: userId,
  });

  await syncVolunteerAssignments(event._id, [], volunteerIds);

  const populatedEvent = await Event.findById(event._id).populate('volunteers', 'name email');
  const sanitizedEvent = sanitizeEvent(populatedEvent);

  logEventCreated(sanitizedEvent);

  return sanitizedEvent;
};

export const getEvents = async ({ page = 1, limit = 10, search = '' }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const skip = (safePage - 1) * safeLimit;
  const trimmedSearch = search.trim();
  const query = trimmedSearch
    ? {
        $or: [
          { title: { $regex: trimmedSearch, $options: 'i' } },
          { description: { $regex: trimmedSearch, $options: 'i' } },
          { location: { $regex: trimmedSearch, $options: 'i' } },
        ],
      }
    : {};

  const [events, total] = await Promise.all([
    Event.find(query).populate('volunteers', 'name email').sort({ date: -1 }).skip(skip).limit(safeLimit),
    Event.countDocuments(query),
  ]);

  return {
    events: events.map(sanitizeEvent),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    },
  };
};

export const getEventById = async (id) => {
  ensureValidObjectId(id, 'event id');
  const event = await Event.findById(id).populate('volunteers', 'name email');

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  return sanitizeEvent(event);
};

export const updateEvent = async (id, payload) => {
  ensureValidObjectId(id, 'event id');
  const event = await Event.findById(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const previousVolunteerIds = event.volunteers.map((volunteerId) => volunteerId.toString());
  const nextVolunteerIds = payload.volunteers
    ? await validateVolunteerIds(payload.volunteers)
    : previousVolunteerIds;

  Object.assign(event, {
    ...payload,
    volunteers: nextVolunteerIds,
  });

  await event.save();
  await syncVolunteerAssignments(event._id, previousVolunteerIds, nextVolunteerIds);

  const populatedEvent = await Event.findById(event._id).populate('volunteers', 'name email');
  return sanitizeEvent(populatedEvent);
};

export const deleteEvent = async (id) => {
  ensureValidObjectId(id, 'event id');
  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  await syncVolunteerAssignments(event._id, event.volunteers, []);
  return sanitizeEvent(event);
};
