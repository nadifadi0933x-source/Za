const axios = require('axios');

const ANILIST_API = 'https://graphql.anilist.co';
const ANILIST_SEARCH_QUERY = `
  query ($search: String, $type: MediaType) {
    Page(page: 1, perPage: 10) {
      media(search: $search, type: $type) {
        id
        idMal
        title { romaji english native }
        description
        coverImage { large }
        bannerImage
        genres
        status
        episodes
        chapters
        volumes
        averageScore
        popularity
        format
        seasonYear
        studios { nodes { name } }
      }
    }
  }
`;

const ANILIST_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id) {
      id
      idMal
      title { romaji english native }
      description
      coverImage { large }
      bannerImage
      genres
      status
      episodes
      chapters
      volumes
      averageScore
      popularity
      format
      seasonYear
      studios { nodes { name } }
      recommendations { edges { node { media { id } } } }
      relations { edges { node { id } } }
    }
  }
`;

const getAnimeById = async (id) => {
  try {
    const response = await axios.post(ANILIST_API, {
      query: ANILIST_DETAIL_QUERY,
      variables: { id: parseInt(id, 10) },
    });

    const media = response.data.data.Media;
    if (!media) return null;

    return {
      id: media.id,
      malId: media.idMal,
      title: media.title.english || media.title.romaji,
      description: media.description,
      coverImage: media.coverImage.large,
      bannerImage: media.bannerImage,
      genres: media.genres.join(','),
      status: media.status,
      episodes: media.episodes,
      rating: media.averageScore ? media.averageScore / 10 : 0,
      popularity: media.popularity,
      format: media.format,
      seasonYear: media.seasonYear,
      studios: media.studios.nodes.map(s => s.name).join(','),
      recommendations: media.recommendations.edges.map(e => e.node.media.id),
      relations: media.relations.edges.map(e => e.node.id),
    };
  } catch (error) {
    console.error('AniList API error:', error.message);
    return null;
  }
};

const searchAnime = async (search, page = 1, perPage = 20) => {
  try {
    const response = await axios.post(ANILIST_API, {
      query: ANILIST_SEARCH_QUERY,
      variables: { search, type: 'ANIME' },
    });

    const mediaList = response.data.data.Page.media;
    return mediaList.map(media => ({
      id: media.id,
      malId: media.idMal,
      title: media.title.english || media.title.romaji,
      description: media.description,
      coverImage: media.coverImage.large,
      genres: media.genres.join(','),
      status: media.status,
      episodes: media.episodes,
      rating: media.averageScore ? media.averageScore / 10 : 0,
      format: media.format,
    }));
  } catch (error) {
    console.error('AniList API error:', error.message);
    return [];
  }
};

module.exports = {
  getAnimeById,
  searchAnime,
};
