const nodemailer = require('nodemailer');
const config = require('../config/environment');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@example.com',
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error('Mailer error:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Click the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
  });
};

const sendWelcomeEmail = async (email, username) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Anime Platform',
    text: `Welcome ${username}! Thank you for registering on our platform.`,
    html: `<p>Welcome <strong>${username}</strong>!</p><p>Thank you for registering on our platform.</p>`,
  });
};

module.exports = {
  createTransporter,
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
