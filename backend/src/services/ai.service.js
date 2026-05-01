import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const isAiAvailable = () => openai !== null;

/**
 * Generates a smart impact report for an event
 */
export const generateImpactReport = async (eventData) => {
  if (!isAiAvailable()) {
    // Mock Fallback
    return `[MOCK AI] Impact Report: Successfully conducted "${eventData.title}" at ${eventData.location} on ${new Date(eventData.date).toLocaleDateString()}. The event engaged ${eventData.volunteers ? eventData.volunteers.length : 0} volunteers and successfully served ${eventData.peopleServed} individuals. This is a placeholder report generated because no OpenAI API key was found.`;
  }

  try {
    const prompt = `Generate a concise and professional impact report (1-2 paragraphs) for the following event.
Event Name: ${eventData.title}
Description: ${eventData.description}
Location: ${eventData.location}
Date: ${new Date(eventData.date).toLocaleDateString()}
Volunteers participated: ${eventData.volunteers ? eventData.volunteers.length : 0}
People served: ${eventData.peopleServed}
Focus on the impact and success of the event.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Service Error (Impact Report):', error);
    return `[Error generating report] ${error.message}`;
  }
};

/**
 * Generates insights for the dashboard
 */
export const generateDashboardInsights = async (stats) => {
  if (!isAiAvailable()) {
    return "[MOCK AI] System Insight: The organization is maintaining a strong volunteer base. To maximize impact, consider focusing upcoming events in areas with historically high turnout. Placeholder insight due to missing API key.";
  }

  try {
    const prompt = `Given the following organizational statistics, provide 2 short, actionable insights or recommendations for the administration team (e.g. trends to notice, areas to improve).
Total Volunteers: ${stats.totalVolunteers}
Total Events: ${stats.totalEvents}
Total People Served: ${stats.totalPeopleServed}
Total Seva Hours: ${stats.totalSevaHours}
Be brief, professional, and insightful. Return as a plain text string.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Service Error (Dashboard Insights):', error);
    return `[Error generating insights] ${error.message}`;
  }
};

/**
 * Recommends volunteers for an event
 */
export const recommendVolunteers = async (eventData, availableVolunteers) => {
  if (!isAiAvailable()) {
    // Return top 3 available volunteers as mock
    const mocked = availableVolunteers.slice(0, 3).map(v => ({
      volunteerId: v._id,
      name: v.name,
      reason: "[MOCK AI] Selected because of availability (Mock)."
    }));
    return mocked;
  }

  try {
    const prompt = `You are an intelligent volunteer coordinator. Recommend the top 3 best volunteers for the following event from the list provided.
Event: ${eventData.title}
Event Description: ${eventData.description}
Event Location: ${eventData.location}

Available Volunteers:
${availableVolunteers.map(v => `- ID: ${v._id}, Name: ${v.name}, Skills: ${v.skills.join(', ')}, Hours: ${v.totalSevaHours}`).join('\n')}

Format your response exactly as a JSON array of objects. Each object must have "volunteerId" (string), "name" (string), and "reason" (a 1-sentence reason why they are a good fit). DO NOT wrap in markdown \`\`\`json blocks. Return only valid JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    });

    let rawOutput = response.choices[0].message.content.trim();
    // Safely parse JSON if wrapped in markdown
    if (rawOutput.startsWith('\`\`\`json')) {
      rawOutput = rawOutput.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    return JSON.parse(rawOutput);
  } catch (error) {
    console.error('AI Service Error (Recommend Volunteers):', error);
    return [];
  }
};
