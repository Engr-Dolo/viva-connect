import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { Volunteer } from '../models/Volunteer.js';
import { User } from '../models/User.js';
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
  mediaUrl: event.mediaUrl || '',
  volunteers: (event.volunteers || []).map((v) => {
    if (v && typeof v === 'object' && v.name) {
      return sanitizeVolunteerSummary(v);
    }
    return v.toString();
  }),
  createdBy: event.createdBy,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
});

const validatePersonnelIds = async (personnelIds = []) => {
  const ids = uniqueIds(personnelIds);
  ids.forEach((id) => ensureValidObjectId(id, 'personnel id'));

  if (ids.length === 0) return [];

  const [volunteerCount, userCount] = await Promise.all([
    Volunteer.countDocuments({ _id: { $in: ids } }),
    User.countDocuments({ _id: { $in: ids }, role: 'coordinator' }),
  ]);

  if (volunteerCount + userCount < ids.length) {
    // Some IDs might be duplicates across collections (unlikely but possible)
    // or simply not found.
    // For now, we trust the combined count or do a more thorough check.
    // Let's do a more thorough check to be safe.
    const foundVolunteers = await Volunteer.find({ _id: { $in: ids } }).select('_id');
    const foundUsers = await User.find({ _id: { $in: ids }, role: 'coordinator' }).select('_id');
    const foundIds = new Set([...foundVolunteers, ...foundUsers].map(doc => doc._id.toString()));
    
    if (foundIds.size !== ids.length) {
      throw new AppError('One or more assigned staff members were not found', 400);
    }
  }

  return ids;
};

const syncVolunteerAssignments = async (eventId, previousIds = [], nextIds = []) => {
  const previous = uniqueIds(previousIds);
  const next = uniqueIds(nextIds);
  
  // We only sync with the Volunteer collection's assignedEvents array
  const volunteersPrevious = await Volunteer.find({ _id: { $in: previous } }).select('_id');
  const volunteersNext = await Volunteer.find({ _id: { $in: next } }).select('_id');
  
  const vPrev = volunteersPrevious.map(v => v._id.toString());
  const vNext = volunteersNext.map(v => v._id.toString());
  
  const toRemove = vPrev.filter((id) => !vNext.includes(id));
  const toAdd = vNext.filter((id) => !vPrev.includes(id));

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
  const personnelIds = await validatePersonnelIds(payload.volunteers);
  const event = await Event.create({
    ...payload,
    volunteers: personnelIds,
    createdBy: userId,
  });

  await syncVolunteerAssignments(event._id, [], personnelIds);

  const populatedEvent = await Event.findById(event._id);
  // Manual population for mixed collections
  const [vols, users] = await Promise.all([
    Volunteer.find({ _id: { $in: personnelIds } }).select('name email'),
    User.find({ _id: { $in: personnelIds } }).select('name email'),
  ]);
  populatedEvent.volunteers = [...vols, ...users];

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
    Event.find(query).sort({ date: -1 }).skip(skip).limit(safeLimit),
    Event.countDocuments(query),
  ]);

  // Bulk populate volunteers for all events
  const allPersonnelIds = uniqueIds(events.flatMap(e => e.volunteers));
  const [vols, users] = await Promise.all([
    Volunteer.find({ _id: { $in: allPersonnelIds } }).select('name email'),
    User.find({ _id: { $in: allPersonnelIds } }).select('name email'),
  ]);
  const personnelMap = new Map([...vols, ...users].map(p => [p._id.toString(), p]));

  events.forEach(e => {
    e.volunteers = e.volunteers.map(id => personnelMap.get(id.toString()) || id);
  });

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
  const event = await Event.findById(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const personnelIds = uniqueIds(event.volunteers);
  const [vols, users] = await Promise.all([
    Volunteer.find({ _id: { $in: personnelIds } }).select('name email'),
    User.find({ _id: { $in: personnelIds } }).select('name email'),
  ]);
  event.volunteers = [...vols, ...users];

  return sanitizeEvent(event);
};

export const updateEvent = async (id, payload) => {
  ensureValidObjectId(id, 'event id');
  const event = await Event.findById(id);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const previousPersonnelIds = event.volunteers.map((vId) => vId.toString());
  const nextPersonnelIds = payload.volunteers
    ? await validatePersonnelIds(payload.volunteers)
    : previousPersonnelIds;

  Object.assign(event, {
    ...payload,
    volunteers: nextPersonnelIds,
  });

  await event.save();
  await syncVolunteerAssignments(event._id, previousPersonnelIds, nextPersonnelIds);

  const [vols, users] = await Promise.all([
    Volunteer.find({ _id: { $in: nextPersonnelIds } }).select('name email'),
    User.find({ _id: { $in: nextPersonnelIds } }).select('name email'),
  ]);
  event.volunteers = [...vols, ...users];

  return sanitizeEvent(event);
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
