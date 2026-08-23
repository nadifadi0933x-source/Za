const db = require('../../config/database');

const getOverview = (req, res, next) => {
  try {
    const totalViews = db.prepare('SELECT SUM(views) as total FROM (SELECT views FROM anime UNION ALL SELECT views FROM manga UNION ALL SELECT views FROM manhwa)').get().total || 0;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalContent = db.prepare('SELECT COUNT(*) as count FROM (SELECT id FROM anime UNION ALL SELECT id FROM manga UNION ALL SELECT id FROM manhwa)').get().count;
    const totalReviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;

    const viewsByType = db.prepare('SELECT "anime" as type, SUM(views) as views FROM anime UNION ALL SELECT "manga" as type, SUM(views) as views FROM manga UNION ALL SELECT "manhwa" as type, SUM(views) as views FROM manhwa').all();
    const viewsByDate = db.prepare('SELECT DATE(created_at) as date, COUNT(*) as count FROM (SELECT created_at FROM anime UNION ALL SELECT created_at FROM manga UNION ALL created_at FROM manhwa) GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30').all();

    return res.status(200).json({
      success: true,
      data: {
        totalViews,
        totalUsers,
        totalContent,
        totalReviews,
        viewsByType,
        viewsByDate,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getPopularContent = (req, res, next) => {
  try {
    const period = req.query.period || 'all';

    let animeQuery = 'SELECT * FROM anime ORDER BY views DESC LIMIT 20';
    let mangaQuery = 'SELECT *, "manga" as content_type FROM manga ORDER BY views DESC LIMIT 20';
    let manhwaQuery = 'SELECT *, "manhwa" as content_type FROM manhwa ORDER BY views DESC LIMIT 20';

    if (period === 'week') {
      animeQuery = 'SELECT * FROM anime WHERE created_at >= datetime("now", "-7 days") ORDER BY views DESC LIMIT 20';
      mangaQuery = 'SELECT *, "manga" as content_type FROM manga WHERE created_at >= datetime("now", "-7 days") ORDER BY views DESC LIMIT 20';
      manhwaQuery = 'SELECT *, "manhwa" as content_type FROM manhwa WHERE created_at >= datetime("now", "-7 days") ORDER BY views DESC LIMIT 20';
    } else if (period === 'month') {
      animeQuery = 'SELECT * FROM anime WHERE created_at >= datetime("now", "-30 days") ORDER BY views DESC LIMIT 20';
      mangaQuery = 'SELECT *, "manga" as content_type FROM manga WHERE created_at >= datetime("now", "-30 days") ORDER BY views DESC LIMIT 20';
      manhwaQuery = 'SELECT *, "manhwa" as content_type FROM manhwa WHERE created_at >= datetime("now", "-30 days") ORDER BY views DESC LIMIT 20';
    }

    const anime = db.prepare(animeQuery).all();
    const manga = db.prepare(mangaQuery).all();
    const manhwa = db.prepare(manhwaQuery).all();

    return res.status(200).json({
      success: true,
      data: {
        anime,
        manga,
        manhwa,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getViewerStats = (req, res, next) => {
  try {
    const period = req.query.period || 'week';
    const groupBy = req.query.groupBy || 'day';

    let dateFilter = '';
    if (period === 'week') {
      dateFilter = "WHERE date >= date('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "WHERE date >= date('now', '-30 days')";
    } else if (period === 'year') {
      dateFilter = "WHERE date >= date('now', '-1 year')";
    }

    const stats = db.prepare(`SELECT date, COUNT(*) as views FROM views ${dateFilter} GROUP BY date ORDER BY date DESC`).all();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
};

const getUserGrowth = (req, res, next) => {
  try {
    const period = req.query.period || 'week';

    let dateFilter = '';
    if (period === 'week') {
      dateFilter = "WHERE date >= date('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "WHERE date >= date('now', '-30 days')";
    } else if (period === 'year') {
      dateFilter = "WHERE date >= date('now', '-1 year')";
    }

    const stats = db.prepare(`SELECT date, COUNT(*) as count FROM users ${dateFilter} GROUP BY date ORDER BY date DESC`).all();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOverview,
  getPopularContent,
  getViewerStats,
  getUserGrowth,
};
