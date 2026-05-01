import { z } from 'zod';

const skillSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20, 'A volunteer can have at most 20 skills')
  .default([]);

export const createVolunteerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('A valid email is required').max(120).toLowerCase(),
  phone: z.string().trim().min(6, 'Phone number must be at least 6 characters').max(30),
  skills: skillSchema,
  availability: z.string().trim().min(2, 'Availability is required').max(160),
  totalSevaHours: z.number().min(0).optional(),
});

export const updateVolunteerSchema = createVolunteerSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required for update',
);
