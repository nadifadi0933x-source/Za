require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  dbPath: process.env.DB_PATH || './src/database/anime_platform.db',
  uploadPath: process.env.UPLOAD_PATH || './src/uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 104857600,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};