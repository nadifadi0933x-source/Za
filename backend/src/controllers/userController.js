const db = require('../../config/database');

const getProfile = (req, res, next) => {
  try {
    const user = db.prepare('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?').get(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

    db.prepare('UPDATE users SET username = ?, bio = ?, avatar = ? WHERE id = ?').run(
      username || req.user.username,
      bio ?? null,
      avatar ?? null,
      req.user.id
    );

    const user = db.prepare('SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?').get(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    const hashHelper = require('../utils/hashHelper');
    const isMatch = await hashHelper.comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const hashedPassword = await hashHelper.hashPassword(newPassword);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getWatchlist = (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM watchlists WHERE user_id = ?';
    const countResult = db.prepare(countQuery).get(req.user.id);
    const total = countResult.total;

    const dataQuery = 'SELECT * FROM watchlists WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    const rows = db.prepare(dataQuery).all(req.user.id, limit, offset);

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

const addToWatchlist = (req, res, next) => {
  try {
    const { content_type, content_id, status } = req.body;

    if (!content_type || !content_id) {
      return res.status(400).json({
        success: false,
        message: 'Content type and content ID are required',
      });
    }

    const validTypes = ['anime', 'manga', 'manhwa'];
    if (!validTypes.includes(content_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type',
      });
    }

    const existing = db.prepare('SELECT id FROM watchlists WHERE user_id = ? AND content_type = ? AND content_id = ?').get(req.user.id, content_type, content_id);
    if (existing) {
      db.prepare('UPDATE watchlists SET status = ?, updated_at = ? WHERE id = ?').run(status || 'watching', Date.now(), existing.id);
    } else {
      db.prepare('INSERT INTO watchlists (user_id, content_type, content_id, status) VALUES (?, ?, ?, ?)').run(req.user.id, content_type, content_id, status || 'watching');
    }

    return res.status(200).json({
      success: true,
      message: 'Added to watchlist successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const removeFromWatchlist = (req, res, next) => {
  try {
    const { id } = req.params;

    const item = db.prepare('SELECT id FROM watchlists WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist item not found',
      });
    }

    db.prepare('DELETE FROM watchlists WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Removed from watchlist successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getReadingList = (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM reading_lists WHERE user_id = ?';
    const countResult = db.prepare(countQuery).get(req.user.id);
    const total = countResult.total;

    const dataQuery = 'SELECT * FROM reading_lists WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    const rows = db.prepare(dataQuery).all(req.user.id, limit, offset);

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

const addToReadingList = (req, res, next) => {
  try {
    const { content_type, content_id, status } = req.body;

    if (!content_type || !content_id) {
      return res.status(400).json({
        success: false,
        message: 'Content type and content ID are required',
      });
    }

    const validTypes = ['manga', 'manhwa'];
    if (!validTypes.includes(content_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type',
      });
    }

    const existing = db.prepare('SELECT id FROM reading_lists WHERE user_id = ? AND content_type = ? AND content_id = ?').get(req.user.id, content_type, content_id);
    if (existing) {
      db.prepare('UPDATE reading_lists SET status = ?, updated_at = ? WHERE id = ?').run(status || 'reading', Date.now(), existing.id);
    } else {
      db.prepare('INSERT INTO reading_lists (user_id, content_type, content_id, status) VALUES (?, ?, ?, ?)').run(req.user.id, content_type, content_id, status || 'reading');
    }

    return res.status(200).json({
      success: true,
      message: 'Added to reading list successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const removeFromReadingList = (req, res, next) => {
  try {
    const { id } = req.params;

    const item = db.prepare('SELECT id FROM reading_lists WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Reading list item not found',
      });
    }

    db.prepare('DELETE FROM reading_lists WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Removed from reading list successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getReadingList,
  addToReadingList,
  removeFromReadingList,
};
