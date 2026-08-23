const db = require('../../config/database');

const create = (req, res, next) => {
  try {
    const { manga_id, chapter_number, title, description, pages } = req.body;

    if (manga_id === undefined && !req.body.manhwa_id) {
      return res.status(400).json({
        success: false,
        message: 'Manga ID or Manhwa ID is required',
      });
    }

    let parentId = manga_id;
    let contentType = 'manga';

    if (!manga_id && req.body.manhwa_id) {
      parentId = req.body.manhwa_id;
      contentType = 'manhwa';
    }

    if (contentType === 'manga') {
      const manga = db.prepare('SELECT id FROM manga WHERE id = ?').get(parentId);
      if (!manga) {
        return res.status(404).json({
          success: false,
          message: 'Manga not found',
        });
      }
    } else {
      const manhwa = db.prepare('SELECT id FROM manhwa WHERE id = ?').get(parentId);
      if (!manhwa) {
        return res.status(404).json({
          success: false,
          message: 'Manhwa not found',
        });
      }
    }

    const result = db.prepare(
      'INSERT INTO chapters (manga_id, manhwa_id, chapter_number, title, description, pages) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(contentType === 'manga' ? parentId : null, contentType === 'manhwa' ? parentId : null, chapter_number || 1, title || '', description || '', pages ? JSON.stringify(pages) : '[]');

    const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(result.lastInsertRowid);
    chapter.pages = chapter.pages ? JSON.parse(chapter.pages) : [];

    return res.status(201).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    return next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const { id } = req.params;

    const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    chapter.pages = chapter.pages ? JSON.parse(chapter.pages) : [];

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    return next(error);
  }
};

const update = (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, pages } = req.body;

    const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    const newPages = pages ? JSON.stringify(pages) : chapter.pages;

    db.prepare(
      'UPDATE chapters SET title = ?, description = ?, pages = ? WHERE id = ?'
    ).run(title ?? chapter.title, description ?? chapter.description, newPages, id);

    const updated = db.prepare('SELECT * FROM chapters WHERE id = ?').get(id);
    updated.pages = updated.pages ? JSON.parse(updated.pages) : [];

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

const remove = (req, res, next) => {
  try {
    const { id } = req.params;

    const chapter = db.prepare('SELECT id FROM chapters WHERE id = ?').get(id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    db.prepare('DELETE FROM chapters WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Chapter deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  getById,
  update,
  remove,
};
