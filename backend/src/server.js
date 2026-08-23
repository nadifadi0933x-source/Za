require('dotenv').config();
const path = require('path');
const fs = require('fs');

async function bootstrap() {
  const { initDatabase } = require('./config/database');
  await initDatabase();
  
  const app = require('./app');
  const config = require('./config/environment');
  
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.env}`);
  });
  
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    const { saveDatabase } = require('./config/database');
    await saveDatabase();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
  });
}

bootstrap();
