import api from './api'

const CONTENT_ENDPOINT = '/content'

class ContentService {
  async getAnime(params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/anime`, params)
  }

  async getAnimeById(id) {
    return api.get(`${CONTENT_ENDPOINT}/anime/${id}`)
  }

  async getManga(params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/manga`, params)
  }

  async getMangaById(id) {
    return api.get(`${CONTENT_ENDPOINT}/manga/${id}`)
  }

  async getManhwa(params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/manhwa`, params)
  }

  async getManhwaById(id) {
    return api.get(`${CONTENT_ENDPOINT}/manhwa/${id}`)
  }

  async getTrending(params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/trending`, params)
  }

  async getNewReleases(params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/new-releases`, params)
  }

  async getTopRated(params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/top-rated`, params)
  }

  async getContinueWatching() {
    return api.get(`${CONTENT_ENDPOINT}/continue-watching`)
  }

  async getGenres(type) {
    return api.get(`${CONTENT_ENDPOINT}/genres/${type}`)
  }

  async getContentByGenre(type, genreId, params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/${type}/genre/${genreId}`, params)
  }

  async search(query, type = 'all', params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/search`, { q: query, type, ...params })
  }

  async getEpisodes(animeId, params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/anime/${animeId}/episodes`, params)
  }

  async getChapters(mangaId, params = {}) {
    return api.getWithParams(`${CONTENT_ENDPOINT}/manga/${mangaId}/chapters`, params)
  }

  async getEpisode(animeId, episodeNumber) {
    return api.get(`${CONTENT_ENDPOINT}/anime/${animeId}/episodes/${episodeNumber}`)
  }

  async getChapter(mangaId, chapterNumber) {
    return api.get(`${CONTENT_ENDPOINT}/manga/${mangaId}/chapters/${chapterNumber}`)
  }

  async getRelated(contentId) {
    return api.get(`${CONTENT_ENDPOINT}/${contentId}/related`)
  }

  async getRecommendations(contentId) {
    return api.get(`${CONTENT_ENDPOINT}/${contentId}/recommendations`)
  }

  async rateContent(contentId, rating) {
    return api.post(`${CONTENT_ENDPOINT}/${contentId}/rate`, { rating })
  }

  async getStreamUrl(episodeId) {
    return api.get(`${CONTENT_ENDPOINT}/stream/${episodeId}`)
  }

  async getTrailer(contentId) {
    return api.get(`${CONTENT_ENDPOINT}/${contentId}/trailer`)
  }
}

export default new ContentService()
