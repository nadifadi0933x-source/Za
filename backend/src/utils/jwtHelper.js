const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

const generateResetToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '1h',
  });
};

const verifyResetToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  signToken,
  verifyToken,
  generateResetToken,
  verifyResetToken,
  decodeToken,
};
