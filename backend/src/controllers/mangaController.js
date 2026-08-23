const db = require('../../config/database');
const jikanAPI = require('../utils/jikanAPI');

const getList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const status = req.query.status || '';

    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }
    if (genre) {
      where += ' AND genre LIKE ?';
      params.push(`%${genre}%`);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    const countQuery = `SELECT COUNT(*) as total FROM manga ${where}`;
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult.total;

    const dataQuery = `SELECT * FROM manga ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const rows = db.prepare(dataQuery).all(...params, limit, offset);

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

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const manga = db.prepare('SELECT * FROM manga WHERE id = ?').get(id);
    if (!manga) {
      return res.status(404).json({
        success: false,
        message: 'Manga not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: manga,
    });
  } catch (error) {
    return next(error);
  }
};

const getChapters = (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const manga = db.prepare('SELECT id FROM manga WHERE id = ?').get(id);
    if (!manga) {
      return res.status(404).json({
        success: false,
        message: 'Manga not found',
      });
    }

    const countQuery = 'SELECT COUNT(*) as total FROM chapters WHERE manga_id = ?';
    const countResult = db.prepare(countQuery).get(id);
    const total = countResult.total;

    const dataQuery = 'SELECT * FROM chapters WHERE manga_id = ? ORDER BY chapter_number ASC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    const rows = db.prepare(dataQuery).all(id, limit, offset);

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

const getPopular = (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM manga ORDER BY views DESC LIMIT 10').all();

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
};

const getTopRated = (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM manga ORDER BY rating DESC LIMIT 10').all();

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
};

const getRecent = (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM manga ORDER BY created_at DESC LIMIT 10').all();

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
};

const syncJikan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const external = await jikanAPI.getMangaById(id);
    if (!external) {
      return res.status(404).json({
        success: false,
        message: 'Manga not found on Jikan',
      });
    }

    return res.status(200).json({
      success: true,
      data: external,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getList,
  getById,
  getChapters,
  getPopular,
  getTopRated,
  getRecent,
  syncJikan,
};
