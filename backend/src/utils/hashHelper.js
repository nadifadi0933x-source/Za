const bcrypt = require('bcrypt');
const config = require('../config/environment');

const hashPassword = async (password) => {
  return bcrypt.hash(password, config.bcryptRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateRandomString = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateNumericCode = (length = 6) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomString,
  generateNumericCode,
};
