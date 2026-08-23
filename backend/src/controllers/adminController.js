const db = require('../../config/database');

const getStats = (req, res, next) => {
  try {
    const animeCount = db.prepare('SELECT COUNT(*) as count FROM anime').get().count;
    const mangaCount = db.prepare('SELECT COUNT(*) as count FROM manga').get().count;
    const manhwaCount = db.prepare('SELECT COUNT(*) as count FROM manhwa').get().count;
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;

    const stats = {
      anime: animeCount,
      manga: mangaCount,
      manhwa: manhwaCount,
      users: userCount,
      reviews: reviewCount,
      totalContent: animeCount + mangaCount + manhwaCount,
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM users';
    const countResult = db.prepare(countQuery).get();
    const total = countResult.total;

    const dataQuery = 'SELECT id, username, email, role, avatar, bio, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = db.prepare(dataQuery).all(limit, offset);

    return res.status(200).json({
      success: true,
      data: rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserRole = (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getContentStats = (req, res, next) => {
  try {
    const anime = db.prepare('SELECT * FROM anime ORDER BY views DESC LIMIT 20').all();
    const manga = db.prepare('SELECT * FROM manga ORDER BY views DESC LIMIT 20').all();
    const manhwa = db.prepare('SELECT * FROM manhwa ORDER BY views DESC LIMIT 20').all();

    const reviews = db.prepare('SELECT content_type, content_id, COUNT(*) as count FROM reviews GROUP BY content_type, content_id ORDER BY count DESC LIMIT 20').all();

    return res.status(200).json({
      success: true,
      data: {
        anime,
        manga,
        manhwa,
        reviews,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const manageContent = (req, res, next) => {
  try {
    const { content_type, content_id, action } = req.body;

    if (!['anime', 'manga', 'manhwa'].includes(content_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type',
      });
    }

    if (action === 'delete') {
      const tableMap = {
        anime: 'anime',
        manga: 'manga',
        manhwa: 'manhwa',
      };
      const table = tableMap[content_type];
      const result = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(content_id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }
      db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(content_id);
    }

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getContentStats,
  manageContent,
};
