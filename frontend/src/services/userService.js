import api from './api'

const USER_ENDPOINT = '/users'

class UserService {
  async getUserProfile() {
    return api.get(`${USER_ENDPOINT}/profile`)
  }

  async updateProfile(userData) {
    return api.put(`${USER_ENDPOINT}/profile`, userData)
  }

  async updateAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.postFormData(`${USER_ENDPOINT}/avatar`, formData)
  }

  async getFavorites(params = {}) {
    return api.getWithParams(`${USER_ENDPOINT}/favorites`, params)
  }

  async addToFavorites(contentId) {
    return api.post(`${USER_ENDPOINT}/favorites`, { contentId })
  }

  async removeFromFavorites(contentId) {
    return api.delete(`${USER_ENDPOINT}/favorites/${contentId}`)
  }

  async checkFavorite(contentId) {
    return api.get(`${USER_ENDPOINT}/favorites/check/${contentId}`)
  }

  async getWatchHistory(params = {}) {
    return api.getWithParams(`${USER_ENDPOINT}/history`, params)
  }

  async addToHistory(data) {
    return api.post(`${USER_ENDPOINT}/history`, data)
  }

  async removeFromHistory(id) {
    return api.delete(`${USER_ENDPOINT}/history/${id}`)
  }

  async clearHistory() {
    return api.delete(`${USER_ENDPOINT}/history`)
  }

  async getSubscriptions() {
    return api.get(`${USER_ENDPOINT}/subscriptions`)
  }

  async createSubscription(subscriptionData) {
    return api.post(`${USER_ENDPOINT}/subscriptions`, subscriptionData)
  }

  async cancelSubscription() {
    return api.post(`${USER_ENDPOINT}/subscriptions/cancel`)
  }

  async getNotifications(params = {}) {
    return api.getWithParams(`${USER_ENDPOINT}/notifications`, params)
  }

  async markNotificationAsRead(notificationId) {
    return api.patch(`${USER_ENDPOINT}/notifications/${notificationId}/read`)
  }

  async markAllNotificationsAsRead() {
    return api.post(`${USER_ENDPOINT}/notifications/read-all`)
  }

  async updateNotificationSettings(settings) {
    return api.put(`${USER_ENDPOINT}/notification-settings`, settings)
  }

  async getAchievements() {
    return api.get(`${USER_ENDPOINT}/achievements`)
  }

  async getStats() {
    return api.get(`${USER_ENDPOINT}/stats`)
  }
}

export default new UserService()
