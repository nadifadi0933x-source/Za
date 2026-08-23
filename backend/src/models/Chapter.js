const db = require('../config/database');

class Chapter {
  constructor() {
    this.tableName = 'chapters';
  }

  findByContentId(contentType, contentId) {
    const stmt = db.prepare('SELECT * FROM chapters WHERE content_type = ? AND content_id = ? ORDER BY chapter_number ASC');
    return stmt.all(contentType, contentId);
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM chapters WHERE id = ?');
    return stmt.get(id);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO chapters (content_type, content_id, chapter_number, title, title_farsi, pages, images)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.content_type,
      data.content_id,
      data.chapter_number,
      data.title || null,
      data.title_farsi || null,
      data.pages || 0,
      data.images || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    const allowedFields = ['content_type', 'content_id', 'chapter_number', 'title', 'title_farsi', 'pages', 'images'];

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

    const sql = `UPDATE chapters SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM chapters WHERE id = ?');
    return stmt.run(id);
  }

  getByContentType(contentType, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const stmt = db.prepare('SELECT * FROM chapters WHERE content_type = ? ORDER BY chapter_number ASC LIMIT ? OFFSET ?');
    return stmt.all(contentType, limit, offset);
  }
}

module.exports = new Chapter();