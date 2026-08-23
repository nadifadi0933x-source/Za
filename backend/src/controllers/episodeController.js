const db = require('../../config/database');
const streamHelper = require('../utils/streamHelper');

const create = (req, res, next) => {
  try {
    const { anime_id, episode_number, title, description, video_url, thumbnail_url, duration } = req.body;

    if (!anime_id || episode_number === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Anime ID and episode number are required',
      });
    }

    const anime = db.prepare('SELECT id FROM anime WHERE id = ?').get(anime_id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found',
      });
    }

    const result = db.prepare(
      'INSERT INTO episodes (anime_id, episode_number, title, description, video_url, thumbnail_url, duration) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(anime_id, episode_number, title || '', description || '', video_url || '', thumbnail_url || '', duration || 0);

    const episode = db.prepare('SELECT * FROM episodes WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      data: episode,
    });
  } catch (error) {
    return next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const { id } = req.params;

    const episode = db.prepare('SELECT * FROM episodes WHERE id = ?').get(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: episode,
    });
  } catch (error) {
    return next(error);
  }
};

const update = (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, video_url, thumbnail_url, duration } = req.body;

    const episode = db.prepare('SELECT * FROM episodes WHERE id = ?').get(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found',
      });
    }

    db.prepare(
      'UPDATE episodes SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, duration = ? WHERE id = ?'
    ).run(title ?? episode.title, description ?? episode.description, video_url ?? episode.video_url, thumbnail_url ?? episode.thumbnail_url, duration ?? episode.duration, id);

    const updated = db.prepare('SELECT * FROM episodes WHERE id = ?').get(id);

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

    const episode = db.prepare('SELECT id FROM episodes WHERE id = ?').get(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found',
      });
    }

    db.prepare('DELETE FROM episodes WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Episode deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const streamVideo = (req, res, next) => {
  try {
    const { id } = req.params;
    const { video_url } = req.query;

    if (!video_url) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required',
      });
    }

    streamHelper.streamVideo(res, video_url);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  getById,
  update,
  remove,
  streamVideo,
};
