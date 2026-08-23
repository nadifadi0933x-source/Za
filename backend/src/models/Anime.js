const db = require('../config/database');

class Anime {
  constructor() {
    this.tableName = 'anime';
  }

  findAll(filters = {}, page = 1, limit = 20) {
    let sql = 'SELECT * FROM anime WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.studio) {
      sql += ' AND studio = ?';
      params.push(filters.studio);
    }

    if (filters.year) {
      sql += ' AND release_year = ?';
      params.push(filters.year);
    }

    if (filters.tag) {
      sql += ' AND tags LIKE ?';
      params.push(`%${filters.tag}%`);
    }

    if (filters.search) {
      sql += ' AND (title LIKE ? OR title_farsi LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.sortBy === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else if (filters.sortBy === 'year') {
      sql += ' ORDER BY release_year DESC';
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = db.prepare(sql);
    return stmt.all(...params);
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM anime WHERE id = ?');
    return stmt.get(id);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO anime (title, title_farsi, description, description_farsi, cover_image, banner_image, studio, status, rating, release_year, episodes_count, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.title_farsi || null,
      data.description || null,
      data.description_farsi || null,
      data.cover_image || null,
      data.banner_image || null,
      data.studio || null,
      data.status || 'ongoing',
      data.rating || 0,
      data.release_year || null,
      data.episodes_count || 0,
      data.tags || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    const allowedFields = ['title', 'title_farsi', 'description', 'description_farsi', 'cover_image', 'banner_image', 'studio', 'status', 'rating', 'release_year', 'episodes_count', 'tags'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    });

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE anime SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM anime WHERE id = ?');
    return stmt.run(id);
  }

  getEpisodes(animeId) {
    const stmt = db.prepare('SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC');
    return stmt.all(animeId);
  }

  getAverageRating(animeId) {
    const stmt = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE content_type = "anime" AND content_id = ?');
    return stmt.get(animeId);
  }
}

module.exports = new Anime();