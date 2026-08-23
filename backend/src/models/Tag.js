const db = require('../config/database');

class Tag {
  constructor() {
    this.tableName = 'tags';
  }

  findAll() {
    const stmt = db.prepare('SELECT * FROM tags ORDER BY name ASC');
    return stmt.all();
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    return stmt.get(id);
  }

  findByName(name) {
    const stmt = db.prepare('SELECT * FROM tags WHERE name = ?');
    return stmt.get(name);
  }

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO tags (name, color)
      VALUES (?, ?)
    `);
    const result = stmt.run(data.name, data.color || '#3B82F6');
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const updates = [];
    const params = [];

    if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
    if (data.color !== undefined) { updates.push('color = ?'); params.push(data.color); }

    if (updates.length === 0) {
      return this.findById(id);
    }

    const sql = `UPDATE tags SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...params);
    return this.findById(id);
  }

  delete(id) {
    const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
    return stmt.run(id);
  }

  getAnimeByTag(tagName) {
    const stmt = db.prepare('SELECT * FROM anime WHERE tags LIKE ?');
    return stmt.all(`%${tagName}%`);
  }
}

module.exports = new Tag();