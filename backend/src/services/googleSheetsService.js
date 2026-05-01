import { google } from 'googleapis';
import { env } from '../config/env.js';

const sheetsConfig = env.googleSheets;

const isConfigured = () => {
  return Boolean(
    sheetsConfig.enabled
      && sheetsConfig.spreadsheetId
      && sheetsConfig.clientEmail
      && sheetsConfig.privateKey,
  );
};

const getSheetsClient = () => {
  const auth = new google.auth.JWT({
    email: sheetsConfig.clientEmail,
    key: sheetsConfig.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

const appendRow = async (range, values) => {
  if (!isConfigured()) {
    return;
  }

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetsConfig.spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [values],
    },
  });
};

const logBackupError = (entity, error) => {
  console.error(`Google Sheets ${entity} backup failed:`, error.message);
};

export const logVolunteerCreated = async (volunteer) => {
  try {
    await appendRow(sheetsConfig.volunteersRange, [
      new Date().toISOString(),
      volunteer.id,
      volunteer.name,
      volunteer.email,
      volunteer.phone,
      volunteer.skills.join(', '),
      volunteer.availability,
      volunteer.totalSevaHours,
      volunteer.createdAt?.toISOString?.() || '',
    ]);
  } catch (error) {
    logBackupError('volunteer', error);
  }
};

export const logEventCreated = async (event) => {
  try {
    await appendRow(sheetsConfig.eventsRange, [
      new Date().toISOString(),
      event.id,
      event.title,
      event.date?.toISOString?.() || new Date(event.date).toISOString(),
      event.location,
      event.peopleServed,
      event.volunteers.map((volunteer) => volunteer.name || volunteer).join(', '),
      event.createdBy?.toString?.() || '',
      event.createdAt?.toISOString?.() || '',
    ]);
  } catch (error) {
    logBackupError('event', error);
  }
};
