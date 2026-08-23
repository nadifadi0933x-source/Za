const db = require('../config/database');

class Episode {
  constructor() {
    this.tableName = 'episodes';
  }

  findByAnimeId(animeId) {
    const stmt = db.prepare('SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC');
    return stmt.all(animeId);
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM episodes WHERE id = ?');
    return stmt.get(id);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO episodes (anime_id, episode_number, title, title_farsi, description, description_farsi, thumbnail, duration, video_url, air_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.anime_id,
      data.episode_number,
      data.title || null,
      data.title_farsi || null,
      data.description || null,
      data.description_farsi || null,
      data.thumbnail || null,
      data.duration || 0,
      data.video_url || null,
      data.air_date || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    const allowedFields = ['anime_id', 'episode_number', 'title', 'title_farsi', 'description', 'description_farsi', 'thumbnail', 'duration', 'video_url', 'air_date'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    });

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('created_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE episodes SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM episodes WHERE id = ?');
    return stmt.run(id);
  }

  getByAnimeId(animeId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare('SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC LIMIT ? OFFSET ?');
    return stmt.all(animeId, limit, offset);
  }
}

module.exports = new Episode();