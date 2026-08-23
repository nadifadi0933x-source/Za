const db = require('../../config/database');

const searchContent = (req, res, next) => {
  try {
    const query = req.query.q || '';
    const type = req.query.type || 'all';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    let tables = [];
    if (type === 'all' || type === 'anime') {
      tables.push('anime');
    }
    if (type === 'all' || type === 'manga') {
      tables.push('manga');
    }
    if (type === 'all' || type === 'manhwa') {
      tables.push('manhwa');
    }

    const results = [];
    for (const table of tables) {
      const rows = db.prepare(`SELECT *, ? as content_type FROM ${table} WHERE title LIKE ? ORDER BY rating DESC LIMIT ? OFFSET ?`).all(table, `%${query}%`, limit, offset);
      results.push(...rows);
    }

    results.sort((a, b) => b.rating - a.rating);

    return res.status(200).json({
      success: true,
      data: results,
      meta: {
        page,
        limit,
        total: results.length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getSuggestions = (req, res, next) => {
  try {
    const query = req.query.q || '';
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 20);

    if (!query) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const results = [];
    const tables = ['anime', 'manga', 'manhwa'];

    for (const table of tables) {
      const rows = db.prepare(`SELECT id, title, '${table}' as content_type FROM ${table} WHERE title LIKE ? LIMIT ?`).all(`%${query}%`, limit);
      results.push(...rows);
    }

    return res.status(200).json({
      success: true,
      data: results.slice(0, limit),
    });
  } catch (error) {
    return next(error);
  }
};

const getFilters = (req, res, next) => {
  try {
    const animeGenres = db.prepare('SELECT DISTINCT genre FROM anime WHERE genre IS NOT NULL').all();
    const mangaGenres = db.prepare('SELECT DISTINCT genre FROM manga WHERE genre IS NOT NULL').all();
    const manhwaGenres = db.prepare('SELECT DISTINCT genre FROM manhwa WHERE genre IS NOT NULL').all();

    const allGenres = [...new Set([...animeGenres.map(r => r.genre), ...mangaGenres.map(r => r.genre), ...manhwaGenres.map(r => r.genre)])];

    const animeStatuses = db.prepare('SELECT DISTINCT status FROM anime WHERE status IS NOT NULL').all();
    const mangaStatuses = db.prepare('SELECT DISTINCT status FROM manga WHERE status IS NOT NULL').all();
    const manhwaStatuses = db.prepare('SELECT DISTINCT status FROM manhwa WHERE status IS NOT NULL').all();

    const allStatuses = [...new Set([...animeStatuses.map(r => r.status), ...mangaStatuses.map(r => r.status), ...manhwaStatuses.map(r => r.status)])];

    return res.status(200).json({
      success: true,
      data: {
        genres: allGenres,
        statuses: allStatuses,
        types: ['anime', 'manga', 'manhwa'],
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getTrending = (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const type = req.query.type || 'all';

    let results = [];
    if (type === 'all' || type === 'anime') {
      const anime = db.prepare('SELECT *, "anime" as content_type FROM anime ORDER BY views DESC LIMIT ?').all(limit);
      results.push(...anime);
    }
    if (type === 'all' || type === 'manga') {
      const manga = db.prepare('SELECT *, "manga" as content_type FROM manga ORDER BY views DESC LIMIT ?').all(limit);
      results.push(...manga);
    }
    if (type === 'all' || type === 'manhwa') {
      const manhwa = db.prepare('SELECT *, "manhwa" as content_type FROM manhwa ORDER BY views DESC LIMIT ?').all(limit);
      results.push(...manhwa);
    }

    results.sort((a, b) => b.views - a.views);

    return res.status(200).json({
      success: true,
      data: results.slice(0, limit),
    });
  } catch (error) {
    return next(error);
  }
};

const getRecent = (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const type = req.query.type || 'all';

    let results = [];
    if (type === 'all' || type === 'anime') {
      const anime = db.prepare('SELECT *, "anime" as content_type FROM anime ORDER BY created_at DESC LIMIT ?').all(limit);
      results.push(...anime);
    }
    if (type === 'all' || type === 'manga') {
      const manga = db.prepare('SELECT *, "manga" as content_type FROM manga ORDER BY created_at DESC LIMIT ?').all(limit);
      results.push(...manga);
    }
    if (type === 'all' || type === 'manhwa') {
      const manhwa = db.prepare('SELECT *, "manhwa" as content_type FROM manhwa ORDER BY created_at DESC LIMIT ?').all(limit);
      results.push(...manhwa);
    }

    results.sort((a, b) => b.created_at - a.created_at);

    return res.status(200).json({
      success: true,
      data: results.slice(0, limit),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  searchContent,
  getSuggestions,
  getFilters,
  getTrending,
  getRecent,
};
