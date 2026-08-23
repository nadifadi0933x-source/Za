module.exports = {
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },

  CONTENT_TYPES: {
    ANIME: 'anime',
    MANGA: 'manga',
    MANHWA: 'manhwa',
  },

  MEDIA_STATUS: {
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    UPCOMING: 'upcoming',
    CANCELLED: 'cancelled',
  },

  WATCHLIST_STATUS: {
    WATCHING: 'watching',
    COMPLETED: 'completed',
    PLAN_TO_WATCH: 'plan_to_watch',
    DROPPED: 'dropped',
    ON_HOLD: 'on_hold',
  },

  UPLOAD_TYPES: {
    IMAGE: 'image',
    VIDEO: 'video',
    THUMBNAIL: 'thumbnail',
  },

  MIME_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  RATING: {
    MIN: 1,
    MAX: 10,
  },
};