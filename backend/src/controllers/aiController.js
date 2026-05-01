import { generateImpactReport, recommendVolunteers, generateDashboardInsights } from '../services/ai.service.js';
import { getEventById } from '../services/eventService.js';
import { getVolunteers } from '../services/volunteerService.js';
import { getDashboardStats } from '../services/dashboardService.js';

// A simple wrapper to handle async errors since catchAsync might not be centrally exported
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const getEventReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const event = await getEventById(id);
  const report = await generateImpactReport(event);
  
  res.status(200).json({
    status: 'success',
    data: { report }
  });
});

export const getVolunteerRecommendations = catchAsync(async (req, res) => {
  const eventData = req.body.eventId 
    ? await getEventById(req.body.eventId) 
    : req.body;
  
  const { volunteers } = await getVolunteers({ limit: 50 });
  
  const recommendations = await recommendVolunteers(eventData, volunteers);
  
  res.status(200).json({
    status: 'success',
    data: { recommendations }
  });
});

export const getDashboardInsights = catchAsync(async (req, res) => {
  const stats = await getDashboardStats();
  const insights = await generateDashboardInsights(stats);
  
  res.status(200).json({
    status: 'success',
    data: { insights }
  });
});
