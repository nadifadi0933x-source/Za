const db = require('../../config/database');

const create = (req, res, next) => {
  try {
    const { content_type, content_id, rating, title, body } = req.body;

    if (!content_type || !content_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Content type, content ID and rating are required',
      });
    }

    const validTypes = ['anime', 'manga', 'manhwa'];
    if (!validTypes.includes(content_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type',
      });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 10',
      });
    }

    const existing = db.prepare('SELECT id FROM reviews WHERE user_id = ? AND content_type = ? AND content_id = ?').get(req.user.id, content_type, content_id);
    if (existing) {
      db.prepare(
        'UPDATE reviews SET rating = ?, title = ?, body = ?, updated_at = ? WHERE id = ?'
      ).run(rating, title || '', body || '', Date.now(), existing.id);
    } else {
      db.prepare(
        'INSERT INTO reviews (user_id, content_type, content_id, rating, title, body) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(req.user.id, content_type, content_id, rating, title || '', body || '');
    }

    const review = db.prepare('SELECT * FROM reviews WHERE user_id = ? AND content_type = ? AND content_id = ?').get(req.user.id, content_type, content_id);
    const user = db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(review.user_id);

    return res.status(201).json({
      success: true,
      data: { ...review, user },
    });
  } catch (error) {
    return next(error);
  }
};

const getByContent = (req, res, next) => {
  try {
    const { content_type, content_id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    const validTypes = ['anime', 'manga', 'manhwa'];
    if (!validTypes.includes(content_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type',
      });
    }

    const countQuery = 'SELECT COUNT(*) as total FROM reviews WHERE content_type = ? AND content_id = ?';
    const countResult = db.prepare(countQuery).get(content_type, content_id);
    const total = countResult.total;

    const dataQuery = 'SELECT * FROM reviews WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = db.prepare(dataQuery).all(content_type, content_id, limit, offset);

    const reviews = rows.map(review => {
      const user = db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(review.user_id);
      return { ...review, user };
    });

    return res.status(200).json({
      success: true,
      data: reviews,
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

const getByUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const countQuery = 'SELECT COUNT(*) as total FROM reviews WHERE user_id = ?';
    const countResult = db.prepare(countQuery).get(userId);
    const total = countResult.total;

    const dataQuery = 'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = db.prepare(dataQuery).all(userId, limit, offset);

    const reviews = rows.map(review => {
      const u = db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(review.user_id);
      return { ...review, user: u };
    });

    return res.status(200).json({
      success: true,
      data: reviews,
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

const updateReview = (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, body } = req.body;

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 10',
      });
    }

    db.prepare(
      'UPDATE reviews SET rating = COALESCE(?, rating), title = COALESCE(?, title), body = COALESCE(?, body), updated_at = ? WHERE id = ?'
    ).run(rating, title, body, Date.now(), id);

    const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    const user = db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(updated.user_id);

    return res.status(200).json({
      success: true,
      data: { ...updated, user },
    });
  } catch (error) {
    return next(error);
  }
};

const removeReview = (req, res, next) => {
  try {
    const { id } = req.params;

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const markHelpful = (req, res, next) => {
  try {
    const { id } = req.params;

    const review = db.prepare('SELECT id FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const existing = db.prepare('SELECT id FROM review_helpful WHERE user_id = ? AND review_id = ?').get(req.user.id, id);
    if (existing) {
      db.prepare('DELETE FROM review_helpful WHERE id = ?').run(existing.id);
      db.prepare('UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = ?').run(id);
    } else {
      db.prepare('INSERT INTO review_helpful (user_id, review_id) VALUES (?, ?)').run(req.user.id, id);
      db.prepare('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?').run(id);
    }

    const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  getByContent,
  getByUser,
  updateReview,
  removeReview,
  markHelpful,
};
