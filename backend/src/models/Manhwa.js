const db = require('../config/database');

class Manhwa {
  constructor() {
    this.tableName = 'manhwa';
  }

  findAll(filters = {}, page = 1, limit = 20) {
    let sql = 'SELECT * FROM manhwa WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.author) {
      sql += ' AND author = ?';
      params.push(filters.author);
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
    const stmt = db.prepare('SELECT * FROM manhwa WHERE id = ?');
    return stmt.get(id);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO manhwa (title, title_farsi, description, description_farsi, cover_image, status, rating, author, artist, release_year, chapters_count, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.title_farsi || null,
      data.description || null,
      data.description_farsi || null,
      data.cover_image || null,
      data.status || 'ongoing',
      data.rating || 0,
      data.author || null,
      data.artist || null,
      data.release_year || null,
      data.chapters_count || 0,
      data.tags || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    const allowedFields = ['title', 'title_farsi', 'description', 'description_farsi', 'cover_image', 'status', 'rating', 'author', 'artist', 'release_year', 'chapters_count', 'tags'];

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

    const sql = `UPDATE manhwa SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM manhwa WHERE id = ?');
    return stmt.run(id);
  }

  getAverageRating(manhwaId) {
    const stmt = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE content_type = "manhwa" AND content_id = ?');
    return stmt.get(manhwaId);
  }
}

module.exports = new Manhwa();