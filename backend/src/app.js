const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const config = require('./config/environment');
const { MIME_TYPES, MAX_FILE_SIZE } = require('./config/constants');

const app = express();

app.use(helmet());

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadDir = path.resolve(config.uploadPath);
['images/anime', 'images/manga', 'images/manhwa', 'videos/anime', 'videos/manga', 'videos/manhwa', 'thumbnails', 'temp'].forEach(dir => {
  const fullPath = path.join(uploadDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'temp/';
    if (file.fieldname === 'cover_image' || file.fieldname === 'banner_image') {
      uploadPath = 'images/anime/';
    } else if (file.fieldname === 'thumbnail') {
      uploadPath = 'thumbnails/';
    } else if (file.fieldname === 'video_url') {
      uploadPath = 'videos/anime/';
    }
    cb(null, path.join(uploadDir, uploadPath));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (MIME_TYPES.IMAGE.includes(file.mimetype) || MIME_TYPES.VIDEO.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

app.use('/uploads', express.static(uploadDir));

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const User = require('../models/User');
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const existingUsername = User.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = User.create({ username, email, password });
    const token = User.generateToken(user);

    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const User = require('../models/User');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = User.generateToken(user);

    res.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const User = require('../models/User');
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role, avatar_url: user.avatar_url });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

app.get('/api/anime', (req, res) => {
  try {
    const Anime = require('../models/Anime');
    const { page, limit, status, studio, year, tag, search, sortBy } = req.query;
    const animeList = Anime.findAll({ status, studio, year, tag, search, sortBy }, parseInt(page) || 1, parseInt(limit) || 20);
    res.json(animeList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch anime', error: error.message });
  }
});

app.get('/api/anime/:id', (req, res) => {
  try {
    const Anime = require('../models/Anime');
    const anime = Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch anime', error: error.message });
  }
});

app.post('/api/anime', authMiddleware, adminOnly, upload.single('cover_image'), (req, res) => {
  try {
    const Anime = require('../models/Anime');
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/images/anime/${req.file.filename}`;
    }
    const anime = Anime.create(data);
    res.status(201).json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create anime', error: error.message });
  }
});

app.put('/api/anime/:id', authMiddleware, adminOnly, upload.single('cover_image'), (req, res) => {
  try {
    const Anime = require('../models/Anime');
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/images/anime/${req.file.filename}`;
    }
    const anime = Anime.update(req.params.id, data);
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update anime', error: error.message });
  }
});

app.delete('/api/anime/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const Anime = require('../models/Anime');
    Anime.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete anime', error: error.message });
  }
});

app.get('/api/anime/:id/episodes', (req, res) => {
  try {
    const Episode = require('../models/Episode');
    const episodes = Episode.findByAnimeId(req.params.id);
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch episodes', error: error.message });
  }
});

app.post('/api/anime/:id/episodes', authMiddleware, adminOnly, (req, res) => {
  try {
    const Episode = require('../models/Episode');
    const data = { ...req.body, anime_id: parseInt(req.params.id) };
    const episode = Episode.create(data);
    res.status(201).json(episode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create episode', error: error.message });
  }
});

app.get('/api/manga', (req, res) => {
  try {
    const Manga = require('../models/Manga');
    const { page, limit, status, author, year, tag, search, sortBy } = req.query;
    const mangaList = Manga.findAll({ status, author, year, tag, search, sortBy }, parseInt(page) || 1, parseInt(limit) || 20);
    res.json(mangaList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manga', error: error.message });
  }
});

app.get('/api/manga/:id', (req, res) => {
  try {
    const Manga = require('../models/Manga');
    const manga = Manga.findById(req.params.id);
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }
    res.json(manga);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manga', error: error.message });
  }
});

app.post('/api/manga', authMiddleware, adminOnly, upload.single('cover_image'), (req, res) => {
  try {
    const Manga = require('../models/Manga');
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/images/manga/${req.file.filename}`;
    }
    const manga = Manga.create(data);
    res.status(201).json(manga);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create manga', error: error.message });
  }
});

app.put('/api/manga/:id', authMiddleware, adminOnly, upload.single('cover_image'), (req, res) => {
  try {
    const Manga = require('../models/Manga');
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/images/manga/${req.file.filename}`;
    }
    const manga = Manga.update(req.params.id, data);
    res.json(manga);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update manga', error: error.message });
  }
});

app.delete('/api/manga/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const Manga = require('../models/Manga');
    Manga.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete manga', error: error.message });
  }
});

app.get('/api/manhwa', (req, res) => {
  try {
    const Manhwa = require('../models/Manhwa');
    const { page, limit, status, author, year, tag, search, sortBy } = req.query;
    const manhwaList = Manhwa.findAll({ status, author, year, tag, search, sortBy }, parseInt(page) || 1, parseInt(limit) || 20);
    res.json(manhwaList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manhwa', error: error.message });
  }
});

app.get('/api/manhwa/:id', (req, res) => {
  try {
    const Manhwa = require('../models/Manhwa');
    const manhwa = Manhwa.findById(req.params.id);
    if (!manhwa) {
      return res.status(404).json({ message: 'Manhwa not found' });
    }
    res.json(manhwa);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manhwa', error: error.message });
  }
});

app.post('/api/manhwa', authMiddleware, adminOnly, upload.single('cover_image'), (req, res) => {
  try {
    const Manhwa = require('../models/Manhwa');
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/images/manhwa/${req.file.filename}`;
    }
    const manhwa = Manhwa.create(data);
    res.status(201).json(manhwa);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create manhwa', error: error.message });
  }
});

app.put('/api/manhwa/:id', authMiddleware, adminOnly, upload.single('cover_image'), (req, res) => {
  try {
    const Manhwa = require('../models/Manhwa');
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/images/manhwa/${req.file.filename}`;
    }
    const manhwa = Manhwa.update(req.params.id, data);
    res.json(manhwa);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update manhwa', error: error.message });
  }
});

app.delete('/api/manhwa/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const Manhwa = require('../models/Manhwa');
    Manhwa.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete manhwa', error: error.message });
  }
});

app.get('/api/chapters', (req, res) => {
  try {
    const Chapter = require('../models/Chapter');
    const { contentType, contentId, page, limit } = req.query;
    if (!contentType || !contentId) {
      return res.status(400).json({ message: 'contentType and contentId are required' });
    }
    const chapters = Chapter.findByContentId(contentType, parseInt(contentId));
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: error.message });
  }
});

app.post('/api/chapters', authMiddleware, adminOnly, (req, res) => {
  try {
    const Chapter = require('../models/Chapter');
    const chapter = Chapter.create(req.body);
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create chapter', error: error.message });
  }
});

app.put('/api/chapters/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const Chapter = require('../models/Chapter');
    const chapter = Chapter.update(req.params.id, req.body);
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update chapter', error: error.message });
  }
});

app.delete('/api/chapters/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const Chapter = require('../models/Chapter');
    Chapter.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete chapter', error: error.message });
  }
});

app.get('/api/reviews', (req, res) => {
  try {
    const Review = require('../models/Review');
    const { contentType, contentId, userId, page, limit } = req.query;
    let reviews;

    if (userId) {
      reviews = Review.findByUser(parseInt(userId), parseInt(page) || 1, parseInt(limit) || 20);
    } else if (contentType && contentId) {
      reviews = Review.findByContent(contentType, parseInt(contentId), parseInt(page) || 1, parseInt(limit) || 20);
    } else {
      reviews = [];
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  try {
    const Review = require('../models/Review');
    const { content_type, content_id, rating, comment } = req.body;

    if (!content_type || !content_id || !rating) {
      return res.status(400).json({ message: 'content_type, content_id and rating are required' });
    }

    const existing = Review.getUserReview(req.user.id, content_type, content_id);
    let review;
    if (existing) {
      review = Review.update(existing.id, { rating, comment });
    } else {
      review = Review.create({ user_id: req.user.id, content_type, content_id, rating, comment });
    }

    res.status(existing ? 200 : 201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
});

app.put('/api/reviews/:id', authMiddleware, (req, res) => {
  try {
    const Review = require('../models/Review');
    const review = Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = Review.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
});

app.delete('/api/reviews/:id', authMiddleware, (req, res) => {
  try {
    const Review = require('../models/Review');
    const review = Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Review.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
});

app.get('/api/watchlist', authMiddleware, (req, res) => {
  try {
    const Watchlist = require('../models/Watchlist');
    const { page, limit } = req.query;
    const watchlist = Watchlist.findByUserId(req.user.id, parseInt(page) || 1, parseInt(limit) || 20);
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message });
  }
});

app.post('/api/watchlist', authMiddleware, (req, res) => {
  try {
    const Watchlist = require('../models/Watchlist');
    const { anime_id, status, current_episode } = req.body;
    const watchlist = Watchlist.updateByUserAnime(req.user.id, anime_id, { status, current_episode });
    res.status(201).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update watchlist', error: error.message });
  }
});

app.delete('/api/watchlist/:animeId', authMiddleware, (req, res) => {
  try {
    const Watchlist = require('../models/Watchlist');
    Watchlist.deleteByUserAnime(req.user.id, req.params.animeId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from watchlist', error: error.message });
  }
});

app.get('/api/tags', (req, res) => {
  try {
    const Tag = require('../models/Tag');
    const tags = Tag.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tags', error: error.message });
  }
});

app.post('/api/tags', authMiddleware, adminOnly, (req, res) => {
  try {
    const Tag = require('../models/Tag');
    const tag = Tag.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tag', error: error.message });
  }
});

app.get('/api/tags/:id/anime', (req, res) => {
  try {
    const Tag = require('../models/Tag');
    const anime = Tag.getAnimeByTag(req.params.id);
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch anime by tag', error: error.message });
  }
});

app.get('/api/search', (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = {};
    if (!type || type === 'anime') {
      results.anime = require('../models/Anime').findAll({ search: q }, 1, 10);
    }
    if (!type || type === 'manga') {
      results.manga = require('../models/Manga').findAll({ search: q }, 1, 10);
    }
    if (!type || type === 'manhwa') {
      results.manhwa = require('../models/Manhwa').findAll({ search: q }, 1, 10);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
  next();
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;