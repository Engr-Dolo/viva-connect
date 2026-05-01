import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
      },
    ],
    peopleServed: {
      type: Number,
      default: 0,
      min: 0,
    },
    mediaUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({ date: 1 });
eventSchema.index({ title: 'text', description: 'text', location: 'text' });

export const Event = mongoose.model('Event', eventSchema);
