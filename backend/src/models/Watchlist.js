const db = require('../config/database');
const { WATCHLIST_STATUS } = require('../config/constants');

class Watchlist {
  constructor() {
    this.tableName = 'watchlists';
  }

  findByUserId(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare(`
      SELECT w.*, a.title, a.title_farsi, a.cover_image, a.status as anime_status, a.episodes_count
      FROM watchlists w
      JOIN anime a ON w.anime_id = a.id
      WHERE w.user_id = ?
      ORDER BY w.updated_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset);
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM watchlists WHERE id = ?');
    return stmt.get(id);
  }

  findByUserAndAnime(userId, animeId) {
    const stmt = db.prepare('SELECT * FROM watchlists WHERE user_id = ? AND anime_id = ?');
    return stmt.get(userId, animeId);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO watchlists (user_id, anime_id, status, current_episode)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.user_id,
      data.anime_id,
      data.status || WATCHLIST_STATUS.PLAN_TO_WATCH,
      data.current_episode || 0
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
    if (data.current_episode !== undefined) { updates.push('current_episode = ?'); params.push(data.current_episode); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE watchlists SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  updateByUserAnime(userId, animeId, data) {
    const existing = this.findByUserAndAnime(userId, animeId);
    if (!existing) {
      return this.create({ user_id: userId, anime_id: animeId, ...data });
    }
    return this.update(existing.id, data);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM watchlists WHERE id = ?');
    return stmt.run(id);
  }

  deleteByUserAnime(userId, animeId) {
    const stmt = db.prepare('DELETE FROM watchlists WHERE user_id = ? AND anime_id = ?');
    return stmt.run(userId, animeId);
  }

  getStats(userId) {
    const stmt = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM watchlists
      WHERE user_id = ?
      GROUP BY status
    `);
    return stmt.all(userId);
  }
}

module.exports = new Watchlist();