const db = require('../../config/database');
const jwtHelper = require('../utils/jwtHelper');
const hashHelper = require('../utils/hashHelper');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password',
      });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    const hashedPassword = await hashHelper.hashPassword(password);

    const result = db.prepare(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(username, email, hashedPassword, 'user');

    const token = jwtHelper.signToken({ id: result.lastInsertRowid, username, role: 'user' });

    return res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        username,
        email,
        role: 'user',
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = db.prepare('SELECT id, username, email, password, role FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await hashHelper.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwtHelper.signToken({ id: user.id, username: user.username, role: user.role });

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const decoded = jwtHelper.verifyToken(token);
    const newToken = jwtHelper.signToken({ id: decoded.id, username: decoded.username, role: decoded.role });

    return res.status(200).json({
      success: true,
      data: { token: newToken },
    });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const resetToken = jwtHelper.generateResetToken({ id: user.id });

    return res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      data: { resetToken },
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required',
      });
    }

    const decoded = jwtHelper.verifyResetToken(token);
    const hashedPassword = await hashHelper.hashPassword(password);

    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, decoded.id);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
};
