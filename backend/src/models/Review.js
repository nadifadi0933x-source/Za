const db = require('../config/database');

class Review {
  constructor() {
    this.tableName = 'reviews';
  }

  findByContent(contentType, contentId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare(`
      SELECT r.*, u.username, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.content_type = ? AND r.content_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(contentType, contentId, limit, offset);
  }

  findByUser(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare(`
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset);
  }

  findById(id) {
    const stmt = db.prepare(`
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `);
    return stmt.get(id);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO reviews (user_id, content_type, content_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(data.user_id, data.content_type, data.content_id, data.rating, data.comment || null);
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    if (data.rating !== undefined) { updates.push('rating = ?'); params.push(data.rating); }
    if (data.comment !== undefined) { updates.push('comment = ?'); params.push(data.comment); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
    return stmt.run(id);
  }

  getAverageRating(contentType, contentId) {
    const stmt = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE content_type = ? AND content_id = ?');
    return stmt.get(contentType, contentId);
  }

  getUserReview(userId, contentType, contentId) {
    const stmt = db.prepare('SELECT * FROM reviews WHERE user_id = ? AND content_type = ? AND content_id = ?');
    return stmt.get(userId, contentType, contentId);
  }
}

module.exports = new Review();