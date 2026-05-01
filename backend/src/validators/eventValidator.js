import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid volunteer id');

export const createEventSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  description: z.string().trim().min(2, 'Description is required').max(1000),
  date: z.coerce.date({ message: 'A valid date is required' }),
  location: z.string().trim().min(2, 'Location is required').max(180),
  volunteers: z.array(objectIdSchema).default([]),
  peopleServed: z.number().int().min(0).default(0),
  mediaUrl: z.string().url('Must be a valid URL').max(500).optional().or(z.literal('')),
});

export const updateEventSchema = createEventSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required for update',
);
