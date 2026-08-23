CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
  avatar_url TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anime (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_farsi TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  description_farsi TEXT DEFAULT NULL,
  cover_image TEXT DEFAULT NULL,
  banner_image TEXT DEFAULT NULL,
  studio TEXT DEFAULT NULL,
  status TEXT DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed', 'upcoming', 'cancelled')),
  rating REAL DEFAULT 0 CHECK(rating >= 0 AND rating <= 10),
  release_year INTEGER DEFAULT NULL,
  episodes_count INTEGER DEFAULT 0,
  tags TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manga (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_farsi TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  description_farsi TEXT DEFAULT NULL,
  cover_image TEXT DEFAULT NULL,
  status TEXT DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed', 'upcoming', 'cancelled')),
  rating REAL DEFAULT 0 CHECK(rating >= 0 AND rating <= 10),
  author TEXT DEFAULT NULL,
  artist TEXT DEFAULT NULL,
  release_year INTEGER DEFAULT NULL,
  chapters_count INTEGER DEFAULT 0,
  tags TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manhwa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_farsi TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  description_farsi TEXT DEFAULT NULL,
  cover_image TEXT DEFAULT NULL,
  status TEXT DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed', 'upcoming', 'cancelled')),
  rating REAL DEFAULT 0 CHECK(rating >= 0 AND rating <= 10),
  author TEXT DEFAULT NULL,
  artist TEXT DEFAULT NULL,
  release_year INTEGER DEFAULT NULL,
  chapters_count INTEGER DEFAULT 0,
  tags TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anime_id INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  title TEXT DEFAULT NULL,
  title_farsi TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  description_farsi TEXT DEFAULT NULL,
  thumbnail TEXT DEFAULT NULL,
  duration INTEGER DEFAULT 0,
  video_url TEXT DEFAULT NULL,
  air_date DATE DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL CHECK(content_type IN ('manga', 'manhwa')),
  content_id INTEGER NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT DEFAULT NULL,
  title_farsi TEXT DEFAULT NULL,
  pages INTEGER DEFAULT 0,
  images TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK(content_type IN ('anime', 'manga', 'manhwa')),
  content_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
  comment TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS watchlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  anime_id INTEGER NOT NULL,
  status TEXT DEFAULT 'plan_to_watch' CHECK(status IN ('watching', 'completed', 'plan_to_watch', 'dropped', 'on_hold')),
  current_episode INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE(user_id, anime_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK(content_type IN ('anime', 'manga', 'manhwa')),
  content_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS watch_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  anime_id INTEGER NOT NULL,
  episode_id INTEGER NOT NULL,
  progress_seconds INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
  UNIQUE(user_id, episode_id)
);

CREATE INDEX IF NOT EXISTS idx_anime_status ON anime(status);
CREATE INDEX IF NOT EXISTS idx_anime_rating ON anime(rating);
CREATE INDEX IF NOT EXISTS idx_anime_year ON anime(release_year);
CREATE INDEX IF NOT EXISTS idx_episodes_anime_id ON episodes(anime_id);
CREATE INDEX IF NOT EXISTS idx_chapters_content ON chapters(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_content ON reviews(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_progress_user ON watch_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_progress_episode ON watch_progress(episode_id);