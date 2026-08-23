const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { USER_ROLES } = require('../config/constants');

class User {
  constructor() {
    this.tableName = 'users';
  }

  findById(id) {
    const stmt = db.prepare('SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  create({ username, email, password, role = USER_ROLES.USER }) {
    const passwordHash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(username, email, passwordHash, role);
    return this.findById(result.lastInsertRowid);
  }

  update(id, { username, email, avatar_url }) {
    const updates = [];
    const params = [];

    if (username !== undefined) { updates.push('username = ?'); params.push(username); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (avatar_url !== undefined) { updates.push('avatar_url = ?'); params.push(avatar_url); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }

  verifyPassword(plainPassword, hash) {
    return bcrypt.compareSync(plainPassword, hash);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare(`
      SELECT id, username, email, role, avatar_url, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset);
  }
}

module.exports = new User();