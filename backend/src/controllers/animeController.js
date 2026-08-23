const db = require('../../config/database');
const anilistAPI = require('../utils/anilistAPI');
const jikanAPI = require('../utils/jikanAPI');

const getList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const status = req.query.status || '';
    const sort = req.query.sort || 'created_at';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

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

    const countQuery = `SELECT COUNT(*) as total FROM anime ${where}`;
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult.total;

    const dataQuery = `SELECT * FROM anime ${where} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
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

    const anime = db.prepare('SELECT * FROM anime WHERE id = ?').get(id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: anime,
    });
  } catch (error) {
    return next(error);
  }
};

const getEpisodes = (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const anime = db.prepare('SELECT id FROM anime WHERE id = ?').get(id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found',
      });
    }

    const countQuery = 'SELECT COUNT(*) as total FROM episodes WHERE anime_id = ?';
    const countResult = db.prepare(countQuery).get(id);
    const total = countResult.total;

    const dataQuery = 'SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC LIMIT ? OFFSET ?';
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

const getSimilar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const anime = db.prepare('SELECT genre FROM anime WHERE id = ?').get(id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found',
      });
    }

    const rows = db.prepare('SELECT * FROM anime WHERE id != ? AND genre LIKE ? ORDER BY RANDOM() LIMIT 10').all(id, `%${anime.genre.split(',')[0]}%`);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
};

const getTrending = (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM anime ORDER BY views DESC LIMIT 10').all();

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
    const rows = db.prepare('SELECT * FROM anime ORDER BY rating DESC LIMIT 10').all();

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
    const rows = db.prepare('SELECT * FROM anime ORDER BY created_at DESC LIMIT 10').all();

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
};

const syncAnilist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const external = await anilistAPI.getAnimeById(id);
    if (!external) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found on AniList',
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

const syncJikan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const external = await jikanAPI.getAnimeById(id);
    if (!external) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found on Jikan',
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
  getEpisodes,
  getSimilar,
  getTrending,
  getTopRated,
  getRecent,
  syncAnilist,
  syncJikan,
};
