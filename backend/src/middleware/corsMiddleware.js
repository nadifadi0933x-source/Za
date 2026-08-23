const cors = require('cors');
const config = require('../config/environment');

const corsMiddleware = () => {
  const allowedOrigins = config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',');

  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins === '*' || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
  };

  return cors(corsOptions);
};

module.exports = corsMiddleware;
