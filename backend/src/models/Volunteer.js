import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    skills: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    assignedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    totalSevaHours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

volunteerSchema.index({ email: 1 }, { unique: true });
volunteerSchema.index({ name: 'text', email: 'text', skills: 'text' });

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);
