import mongoose from 'mongoose';
import { Volunteer } from '../models/Volunteer.js';
import { AppError } from '../utils/AppError.js';
import { logVolunteerCreated } from './googleSheetsService.js';

const sanitizeVolunteer = (volunteer) => ({
  id: volunteer._id.toString(),
  name: volunteer.name,
  email: volunteer.email,
  phone: volunteer.phone,
  skills: volunteer.skills,
  availability: volunteer.availability,
  assignedEvents: volunteer.assignedEvents,
  totalSevaHours: volunteer.totalSevaHours,
  createdAt: volunteer.createdAt,
  updatedAt: volunteer.updatedAt,
});

const ensureValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid volunteer id', 400);
  }
};

export const createVolunteer = async (payload) => {
  const existingVolunteer = await Volunteer.findOne({ email: payload.email });

  if (existingVolunteer) {
    throw new AppError('A volunteer with this email already exists', 409);
  }

  const volunteer = await Volunteer.create(payload);
  const sanitizedVolunteer = sanitizeVolunteer(volunteer);

  logVolunteerCreated(sanitizedVolunteer);

  return sanitizedVolunteer;
};

export const getVolunteers = async ({ page = 1, limit = 10, search = '' }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const skip = (safePage - 1) * safeLimit;
  const trimmedSearch = search.trim();
  const query = trimmedSearch
    ? {
        $or: [
          { name: { $regex: trimmedSearch, $options: 'i' } },
          { email: { $regex: trimmedSearch, $options: 'i' } },
          { skills: { $regex: trimmedSearch, $options: 'i' } },
        ],
      }
    : {};

  const [volunteers, total] = await Promise.all([
    Volunteer.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    Volunteer.countDocuments(query),
  ]);

  return {
    volunteers: volunteers.map(sanitizeVolunteer),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    },
  };
};

export const getVolunteerById = async (id) => {
  ensureValidObjectId(id);
  const volunteer = await Volunteer.findById(id);

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  return sanitizeVolunteer(volunteer);
};

export const updateVolunteer = async (id, payload) => {
  ensureValidObjectId(id);

  if (payload.email) {
    const existingVolunteer = await Volunteer.findOne({
      email: payload.email,
      _id: { $ne: id },
    });

    if (existingVolunteer) {
      throw new AppError('A volunteer with this email already exists', 409);
    }
  }

  const volunteer = await Volunteer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  return sanitizeVolunteer(volunteer);
};

export const deleteVolunteer = async (id) => {
  ensureValidObjectId(id);
  const volunteer = await Volunteer.findByIdAndDelete(id);

  if (!volunteer) {
    throw new AppError('Volunteer not found', 404);
  }

  return sanitizeVolunteer(volunteer);
};
