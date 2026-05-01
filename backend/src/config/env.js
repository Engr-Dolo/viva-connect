import dotenv from 'dotenv';

const envResult = dotenv.config();

if (envResult.error) {
  dotenv.config({ path: '.env.example' });
}

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsOrigins: (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 100),
  },
  googleSheets: {
    enabled: process.env.GOOGLE_SHEETS_ENABLED === 'true',
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '',
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    volunteersRange: process.env.GOOGLE_SHEETS_VOLUNTEERS_RANGE || 'Volunteers!A:I',
    eventsRange: process.env.GOOGLE_SHEETS_EVENTS_RANGE || 'Events!A:I',
  },
};
