import { Event } from '../models/Event.js';
import { Volunteer } from '../models/Volunteer.js';

const firstResult = (results, fallback) => results[0] || fallback;

export const getDashboardStats = async () => {
  const [volunteerStats, eventStats, recentEvents] = await Promise.all([
    Volunteer.aggregate([
      {
        $group: {
          _id: null,
          totalVolunteers: { $sum: 1 },
          totalSevaHours: { $sum: '$totalSevaHours' },
        },
      },
      {
        $project: {
          _id: 0,
          totalVolunteers: 1,
          totalSevaHours: 1,
        },
      },
    ]),
    Event.aggregate([
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalPeopleServed: { $sum: '$peopleServed' },
        },
      },
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          totalPeopleServed: 1,
        },
      },
    ]),
    Event.find()
      .sort({ date: -1 })
      .limit(5)
      .select('title date location peopleServed')
      .lean(),
  ]);

  const volunteerTotals = firstResult(volunteerStats, {
    totalVolunteers: 0,
    totalSevaHours: 0,
  });
  const eventTotals = firstResult(eventStats, {
    totalEvents: 0,
    totalPeopleServed: 0,
  });

  return {
    totalVolunteers: volunteerTotals.totalVolunteers,
    totalEvents: eventTotals.totalEvents,
    totalPeopleServed: eventTotals.totalPeopleServed,
    totalSevaHours: volunteerTotals.totalSevaHours,
    recentEvents: recentEvents.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      date: event.date,
      location: event.location,
      peopleServed: event.peopleServed,
    })),
  };
};
