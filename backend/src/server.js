import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`VIVA Connect API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start VIVA Connect API:', error);
  process.exit(1);
});