const axios = require('axios');

const JIKAN_API = 'https://api.jikan.moe/v4';

const getAnimeById = async (id) => {
  try {
    const response = await axios.get(`${JIKAN_API}/anime/${id}`);
    const data = response.data.data;
    if (!data) return null;

    return {
      id: data.mal_id,
      title: data.title,
      titleJapanese: data.title_japanese,
      description: data.synopsis,
      coverImage: data.images.jpg.large_image_url,
      bannerImage: data.trailer.images?.maximum_image_url || data.images.jpg.large_image_url,
      genres: data.genres.map(g => g.name).join(','),
      status: data.status,
      episodes: data.episodes,
      rating: data.score || 0,
      popularity: data.popularity,
      rank: data.rank,
      season: data.season,
      year: data.year,
      studios: data.studios.map(s => s.name).join(','),
      type: data.type,
    };
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return null;
  }
};

const getMangaById = async (id) => {
  try {
    const response = await axios.get(`${JIKAN_API}/manga/${id}`);
    const data = response.data.data;
    if (!data) return null;

    return {
      id: data.mal_id,
      title: data.title,
      titleJapanese: data.title_japanese,
      description: data.synopsis,
      coverImage: data.images.jpg.large_image_url,
      genres: data.genres.map(g => g.name).join(','),
      status: data.status,
      chapters: data.chapters,
      volumes: data.volumes,
      rating: data.score || 0,
      popularity: data.popularity,
      rank: data.rank,
      type: data.type,
    };
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return null;
  }
};

const searchAnime = async (query, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${JIKAN_API}/anime`, {
      params: { q: query, page, limit },
    });

    return response.data.data.map(item => ({
      id: item.mal_id,
      title: item.title,
      description: item.synopsis,
      coverImage: item.images.jpg.large_image_url,
      genres: item.genres.map(g => g.name).join(','),
      status: item.status,
      episodes: item.episodes,
      rating: item.score || 0,
      type: item.type,
    }));
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return [];
  }
};

const searchManga = async (query, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${JIKAN_API}/manga`, {
      params: { q: query, page, limit },
    });

    return response.data.data.map(item => ({
      id: item.mal_id,
      title: item.title,
      description: item.synopsis,
      coverImage: item.images.jpg.large_image_url,
      genres: item.genres.map(g => g.name).join(','),
      status: item.status,
      chapters: item.chapters,
      volumes: item.volumes,
      rating: item.score || 0,
      type: item.type,
    }));
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return [];
  }
};

const getTopAnime = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${JIKAN_API}/top/anime`, {
      params: { page, limit },
    });

    return response.data.data.map(item => ({
      id: item.mal_id,
      title: item.title,
      description: item.synopsis,
      coverImage: item.images.jpg.large_image_url,
      genres: item.genres.map(g => g.name).join(','),
      status: item.status,
      episodes: item.episodes,
      rating: item.score || 0,
      type: item.type,
    }));
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return [];
  }
};

const getTopManga = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${JIKAN_API}/top/manga`, {
      params: { page, limit },
    });

    return response.data.data.map(item => ({
      id: item.mal_id,
      title: item.title,
      description: item.synopsis,
      coverImage: item.images.jpg.large_image_url,
      genres: item.genres.map(g => g.name).join(','),
      status: item.status,
      chapters: item.chapters,
      volumes: item.volumes,
      rating: item.score || 0,
      type: item.type,
    }));
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return [];
  }
};

const getSeasonalAnime = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${JIKAN_API}/seasons/now`, {
      params: { page, limit },
    });

    return response.data.data.map(item => ({
      id: item.mal_id,
      title: item.title,
      description: item.synopsis,
      coverImage: item.images.jpg.large_image_url,
      genres: item.genres.map(g => g.name).join(','),
      status: item.status,
      episodes: item.episodes,
      rating: item.score || 0,
      type: item.type,
    }));
  } catch (error) {
    console.error('Jikan API error:', error.message);
    return [];
  }
};

module.exports = {
  getAnimeById,
  getMangaById,
  searchAnime,
  searchManga,
  getTopAnime,
  getTopManga,
  getSeasonalAnime,
};
